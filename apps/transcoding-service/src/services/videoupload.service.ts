import { StorageService } from "@app/common";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import path from "path";
import * as fs from 'fs';
import { pipeline, Readable } from "stream";
import { FfmpegOutput, RENDITION_CONFIGS, RenditionResult, S3UploadResult } from "../types/transcoding.types";

@Injectable()
export class VideoUploadService {
    private readonly logger: Logger = new Logger(StorageService.name);
    private storageClient: S3Client;
    private rawBucket: string;
    private processedBucket: string;
    constructor(private readonly configService: ConfigService) {
        this.storageClient = new S3Client({
            region: configService.get<string>('AWS_REGION'),
            requestChecksumCalculation: 'WHEN_REQUIRED',
            credentials: {
                accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
                secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? ''
            }
        });

        this.rawBucket = configService.get<string>('AWS_S3_RAW_BUCKET_NAME') ?? '';
        this.processedBucket = configService.get<string>('AWS_S3_PROCESSED_BUCKET_NAME') ?? '';
    }


    // ── Stream download from raw bucket ───────────────────────────
    async downloadRaw(key: string, destPath: string): Promise<void> {
        // Get file size for progress logging
        const head = await this.storageClient.send(
            new HeadObjectCommand({ Bucket: this.rawBucket, Key: key }),
        );
        const totalBytes = head.ContentLength ?? 0;
        const totalMB = (totalBytes / 1024 / 1024).toFixed(0);

        this.logger.log(
            `Downloading s3://${this.rawBucket}/${key} (${totalMB} MB)`,
        );

        const response = await this.storageClient.send(
            new GetObjectCommand({ Bucket: this.rawBucket, Key: key }),
        );
        const body = response.Body as Readable;
        const writeStream = fs.createWriteStream(destPath);
        let downloaded = 0;
        let lastLoggedMB = 0;

        // Log progress every 500 MB for large files
        body.on('data', (chunk: Buffer) => {
            downloaded += chunk.length;
            const downloadedMB = downloaded / 1024 / 1024;

            if (downloadedMB - lastLoggedMB >= 500) {
                const pct = totalBytes
                    ? ((downloaded / totalBytes) * 100).toFixed(1)
                    : '?';
                this.logger.log(
                    `Download: ${downloadedMB.toFixed(0)} MB / ${totalMB} MB (${pct}%)`,
                );
                lastLoggedMB = downloadedMB;
            }
        });

        await pipeline(body, writeStream);
        this.logger.log(`Download complete → ${destPath}`);
    }

    // ── Upload all HLS output to CDN bucket ───────────────────────
    async uploadOutput(
        outputDir: string,
        s3Prefix: string,
        ffResult: FfmpegOutput,
    ): Promise<S3UploadResult> {
        const renditions: RenditionResult[] = [];

        // Upload each rendition directory
        for (const { resolution, dir } of ffResult.renditionDirs) {
            const config = RENDITION_CONFIGS.find((r) => r.resolution === resolution)!;
            const files = fs.readdirSync(dir);
            let totalSize = 0;

            for (const file of files) {
                const localPath = path.join(dir, file);
                const s3Key = `${s3Prefix}/${resolution}/${file}`;
                totalSize += fs.statSync(localPath).size;

                await this.uploadProcessedFileToBucket(localPath, s3Key, this.getContentType(file));
            }

            renditions.push({
                resolution,
                storageKey: `${s3Prefix}/${resolution}/index.m3u8`,
                bandwidth: config.bandwidth,
                width: config.width,
                height: config.height,
                fileSize: totalSize,
            });

            this.logger.log(
                `Uploaded ${resolution} → s3://${this.processedBucket}/${s3Prefix}/${resolution}/`,
            );
        }

        // Upload master playlist
        const hlsMasterKey = `${s3Prefix}/master.m3u8`;
        await this.uploadProcessedFileToBucket(
            ffResult.masterPlaylist,
            hlsMasterKey,
            'application/vnd.apple.mpegurl',
        );

        // Upload thumbnail
        const thumbnailKey = `${s3Prefix}/thumbnail.jpg`;
        await this.uploadProcessedFileToBucket(ffResult.thumbnailPath, thumbnailKey, 'image/jpeg');

        this.logger.log(`All files uploaded. Master: ${hlsMasterKey}`);
        return { hlsMasterKey, thumbnailKey, renditions };
    }

    //upload files to the bucket
    async uploadProcessedFileToBucket(
        localPath: string,
        s3Key: string,
        contentType: string,
    ): Promise<void> {
        await this.storageClient.send(
            new PutObjectCommand({
                Bucket: this.processedBucket,
                Key: s3Key,
                Body: fs.createReadStream(localPath),
                ContentType: contentType,
            }),
        );
    }

    private getContentType(filename: string): string {
        if (filename.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
        if (filename.endsWith('.ts')) return 'video/mp2t';
        if (filename.endsWith('.jpg')) return 'image/jpeg';
        return 'application/octet-stream';
    }


} 