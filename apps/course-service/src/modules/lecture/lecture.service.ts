import { ApiResponse, DatabaseService, IPgQuery, ResponseUtil, StorageService } from '@app/common';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FnCreateLectureContentResult, FnCreateTranscodeJobResult, FnGetLectureOwnerResult } from './types/lecture.types';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LectureService {

  private bucket: string;
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService
  ) {
    this.bucket = configService.get<string>('AWS_S3_RAW_BUCKET_NAME') ?? '';
  }



  async getLecturePresignUrl(
    userId: string,
    lectureId: string,
    file: Express.Multer.File
  ): Promise<ApiResponse> {

    const lectureQuery: IPgQuery = {
      query: `SELECT * FROM fn_get_lecture_owner($1, $2)`,
      params: [lectureId, userId],
    };

    const lectureResult = await this.databaseService.queryOne<FnGetLectureOwnerResult>(lectureQuery);

    if (!lectureResult?.success) {
      throw new BadRequestException(lectureResult?.message);
    }

    if (!lectureResult?.data) {
      throw new BadRequestException(lectureResult?.message);
    }

    const courseId = lectureResult.data.courseId;
    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'mp4';
    const rawKey = `raw/${courseId}/${lectureId}/${randomUUID()}.${ext}`;
    const outPath = `processed/${courseId}/${lectureId}`;

    const presignUrl = await this.storageService.getUploadPresignedUrl(
      rawKey,
      file.mimetype,
      this.bucket
    );

    // 3. Create content record
    const contentQuery: IPgQuery = {
      query: `SELECT * FROM fn_create_lecture_content($1, $2, $3)`,
      params: [lectureId, rawKey, file.mimetype],
    };

    const contentResult = await this.databaseService.queryOne<FnCreateLectureContentResult>(contentQuery);

    if (!contentResult?.success) {
      throw new BadRequestException(contentResult?.message);
    }

    // 4. Create transcoding job record
    const jobQuery: IPgQuery = {
      query: `SELECT * FROM fn_create_transcode_job($1, $2, $3, $4, $5, $6)`,
      params: [
        contentResult.data?.contentId,
        lectureId,
        courseId,
        userId,
        rawKey,
        outPath,
      ],
    };
    const jobResult = await this.databaseService.queryOne<FnCreateTranscodeJobResult>(jobQuery);

    if (!jobResult?.success) {
      throw new BadRequestException(jobResult?.message);
    }


    return ResponseUtil.success('Upload URL generated successfully.', {
      presignUrl,
      storageKey: rawKey,
      contentId: contentResult.data?.contentId,
      jobId: jobResult.data?.jobId,
      expiresIn: 900,
    });
  }
}
