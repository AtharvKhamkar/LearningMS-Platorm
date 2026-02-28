import { Bucket, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { extname, parse } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
    private storageClient: S3Client;
    private bucket: string;
    constructor(private readonly configService: ConfigService) {
        this.storageClient = new S3Client({
            region: configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
                secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? ''
            }
        });

        this.bucket = configService.get<string>('AWS_S3_BUCKET_NAME') ?? '';

    }

    /*
    Function used to upload image storage service
    */
    async uploadFile(file: Express.Multer.File): Promise<string> {

        const { name } = parse(file.originalname);

        const key = `${name}_${uuid()}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        });

        await this.storageClient.send(command);

        return key;
    }

    /*
    Function used to get public singed url
    */
    async getSignedFileUrl(key?: string | null): Promise<string | null> {

        //If key is empty string
        if (!key || key.trim() === '') {
            return null;
        }

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        const signedUrl = await getSignedUrl(this.storageClient, command, { expiresIn: 3600 });

        return signedUrl;
    }

    /*
    Function used to delete file from the storage service 
    */
    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        })

        await this.storageClient.send(command);
    }

    /*
    Function used to get presinged url to upload object on the storage service */
    async getUploadPresignedUrl(fileName: string, contentType: string): Promise<{ url: string, key: string }> {

        const key = `${extname(fileName)}_${uuid()}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        const url = await getSignedUrl(this.storageClient, command, { expiresIn: 300 });

        return { url, key };
    }

}