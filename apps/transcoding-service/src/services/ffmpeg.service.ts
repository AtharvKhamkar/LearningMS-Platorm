import { Injectable, Logger } from "@nestjs/common";
import Ffmpeg from 'fluent-ffmpeg';
import { FfmpegOutput, RENDITION_CONFIGS, RenditionConfig } from "../types/transcoding.types";
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class FfmpegService {
    private readonly logger = new Logger(FfmpegService.name);

    async transcode(
    inputPath:   string,
    outputDir:   string,
    resolutions: string[],
  ): Promise<FfmpegOutput> {
    fs.mkdirSync(outputDir, { recursive: true });

    const durationSeconds = await this.getVideoDuration(inputPath);
    this.logger.log(`Video duration: ${durationSeconds}s`);

    const configs = RENDITION_CONFIGS.filter((r) =>
      resolutions.includes(r.resolution),
    );

    const renditionDirs: Array<{ resolution: string; dir: string }> = [];

    // Transcode each resolution sequentially
    for (const config of configs) {
      const renditionDir = path.join(outputDir, config.resolution);
      fs.mkdirSync(renditionDir, { recursive: true });

      this.logger.log(`Transcoding ${config.resolution}...`);
      await this.transcodeRendition(inputPath, renditionDir, config);

      renditionDirs.push({ resolution: config.resolution, dir: renditionDir });
      this.logger.log(`${config.resolution} complete`);
    }

    // Generate master.m3u8
    const masterPlaylist = path.join(outputDir, 'master.m3u8');
    this.generateMasterPlaylist(masterPlaylist, configs);
    this.logger.log('master.m3u8 generated');

    // Extract thumbnail at video midpoint
    const thumbnailPath = path.join(outputDir, 'thumbnail.jpg');
    await this.extractThumbnail(inputPath, thumbnailPath, durationSeconds);
    this.logger.log('Thumbnail extracted');

    return { durationSeconds, renditionDirs, masterPlaylist, thumbnailPath };
  }


    private transcodeRendition(
        inputPath: string,
        renditionDir: string,
        config: RenditionConfig
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            Ffmpeg(inputPath)
                .outputOptions([
                    '-c:v libx264',
                    '-preset fast',
                    '-crf 20',
                    `-b:v ${config.videoBitrate}`,
                    `-maxrate ${config.maxBitrate}`,
                    `-bufsize ${config.bufsize}`,
                    // Scale keeping aspect ratio, pad to exact dimensions
                    `-vf scale=${config.width}:${config.height}:force_original_aspect_ratio=decrease,pad=${config.width}:${config.height}:(ow-iw)/2:(oh-ih)/2`,
                    '-sc_threshold 0',
                    '-g 48',
                    '-keyint_min 48',
                    '-c:a aac',
                    `-b:a ${config.audioBitrate}`,
                    '-ac 2',
                    '-hls_time 6',
                    '-hls_playlist_type vod',
                    '-hls_flags independent_segments',
                    `-hls_segment_filename ${path.join(renditionDir, 'seg%04d.ts')}`,

                ])
                .output(path.join(renditionDir, 'index.m3u8'))
                .on('progress', ({percent}) => {
                    this.logger.debug(
                        `${config.resolution} : ${Math.round(percent ?? 0)}%`,
                    );
                }).
                on('end', () => resolve())
                .on('error', (err) => {
                    this.logger.error(
                        `FFmpeg error (${config.resolution}: ${err.message})`,
                    );
                    reject(err)
                }).run()
        });
    }

    private generateMasterPlaylist(
        outputPath: string,
        configs: RenditionConfig[]
    ): void {
        const lines: string[] = ['#EXTM3U', '#EXT-X-VERSION:3', ''];

        for (const cfg of configs) {
            lines.push(
                `#EXT-X-STREAM-INF:BANDWIDTH=${cfg.bandwidth},` +
                `RESOLUTION=${cfg.width}x${cfg.height},` +
                `CODECS="avc1.42e01e,mp4a.40.2"`,
            );
            lines.push(`${cfg.resolution}/index.m3u8`);
            lines.push('');
        }

        fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')


    }

    private extractThumbnail(
        inputPath: string,
        outputPath: string,
        durationSeconds: number
    ): Promise<void> {
        const seekTo = Math.max(1, Math.floor(durationSeconds / 2));

        return new Promise((resolve, reject) => {
            Ffmpeg(inputPath)
                .seekInput(seekTo)
                .frames(1)
                .outputOptions(['-vf scale=1280:720', '-q:v 2'])
                .output(outputPath)
                .on('end', () => resolve())
                .on('error', reject)
                .run();
        })
    }

    private getVideoDuration(inputPath: string): Promise<number> {
        return new Promise((resolve, reject) => {
            Ffmpeg.ffprobe(inputPath, (err, metadata) => {
                if (err) return reject(err);
                resolve(Math.floor(metadata.format.duration ?? 0));
            });
        });
    }

}