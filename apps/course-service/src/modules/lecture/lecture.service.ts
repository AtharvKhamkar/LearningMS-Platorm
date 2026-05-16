import { ApiResponse, DatabaseService, ResponseUtil, StorageService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LectureService {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService
  ) { }

  async getLecturePresignUrl(
    userId: string,
    lectureId: string,
    file: Express.Multer.File
  ): Promise<ApiResponse>{

    
    return ResponseUtil.success(
        'Upload URL generated successfully.'
    )
  }
}
