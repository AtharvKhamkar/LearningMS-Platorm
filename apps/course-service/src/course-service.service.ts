import { ApiResponse, DatabaseService, IPgQuery, ResponseUtil, StorageService } from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dtos';
import { FnCreateCourseResult } from './types';
import { CreateCourseResponseEntity } from './entities';

@Injectable()
export class CourseServiceService {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService
  ) { }


  //Check user is instructor or not (handled by PermissionGuard)
  //Check Name of the course already exists
  //Insert course into course table
  //Send course created mail to the instructor 
  async create(userId: string, thumbnail: Express.Multer.File, dto: CreateCourseDto): Promise<ApiResponse> {

    const key = await this.storageService.uploadFile(thumbnail);

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_create_course($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      params: [
        dto.categoryId,
        dto.subcategoryId,
        dto.title,
        dto.description,
        dto.requirement,
        dto.courseLearning,
        dto.tags,
        dto.level,
        dto.languageId,
        dto.duration,
        dto.price,
        key,
        userId
      ]
    };

    const queryResult = await this.databaseService.queryOne<FnCreateCourseResult>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(
        queryResult?.message
      )
    }

    return ResponseUtil.success(
      'Course created successfully.',
      new CreateCourseResponseEntity({
        courseId: queryResult.data?.courseId,
        status: queryResult.data?.status
      })
    )
  }
}
