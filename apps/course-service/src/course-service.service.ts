import { ApiResponse, DatabaseService, IPgQuery, ResponseUtil, StorageService } from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from './dtos';
import { FnCreateCourseResult, FnCreateDraftCourseResult, FnPublishCourseResult, FnUnpublishCourseResult, FnUpdateCourseResult, FnUpdateCourseThumbnailResult } from './types';
import { CreateCourseResponseEntity, CreateDraftResponseEntity, PublishCourseResponseEntity, UnpublishCourseResponseEntity, UpdateCourseResponseEntity, UpdateCourseThumbnailResponseEntity } from './entities';

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


  //Check course exists or not
  //Check current user is owner of that course
  //Check if the user has archived the course if it is archived then user
  //user should restricted from the updating
  async update(userId: string,courseId: string, dto: UpdateCourseDto): Promise<ApiResponse> {

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_update_course($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      params: [
        courseId,
        userId,
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
      ]
    };

    const queryResult = await this.databaseService.queryOne<FnUpdateCourseResult>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(
        queryResult?.message
      )
    }

    return ResponseUtil.success(
      queryResult.message,
      new UpdateCourseResponseEntity({
        courseId: queryResult.data?.courseId,
        status: queryResult.data?.status
      })
    )
  }

  async updateThumbnail(courseId: string, userId: string, thumbnail: Express.Multer.File): Promise<ApiResponse> {

    const key = await this.storageService.uploadFile(thumbnail);

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_update_course_thumbnail($1, $2, $3)`,
      params: [
        courseId,
        userId,
        key
      ]
    };

    const queryResult = await this.databaseService.queryOne<FnUpdateCourseThumbnailResult>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(
        queryResult?.message
      )
    }

    const oldThumbnailKey = queryResult?.data?.oldThumbnailKey

    if(oldThumbnailKey){
      await this.storageService.deleteFile(oldThumbnailKey);
    }

    const thumbnailImageUrl = await this.storageService.getSignedFileUrl(queryResult?.data?.updatedThumbnailKey) ?? '';


    return ResponseUtil.success(
      queryResult.message,
      new UpdateCourseThumbnailResponseEntity({
        courseId: queryResult.data?.courseId,
        status: queryResult.data?.status,
        thumbnailUrl: thumbnailImageUrl

      })
    )
  }

  async publish(courseId: string, userId: string): Promise<ApiResponse> {


    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_publish_course($1, $2)`,
      params: [
        courseId,
        userId
      ]
    };

    const queryResult = await this.databaseService.queryOne<FnPublishCourseResult>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(
        queryResult?.message
      )
    }

    return ResponseUtil.success(
      queryResult.message,
      new PublishCourseResponseEntity({
        courseId: queryResult.data?.courseId,
        status: queryResult.data?.status
      })
    )
  }

  async unpublish(courseId: string, userId: string): Promise<ApiResponse> {

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_unpublish_course($1, $2)`,
      params: [
        courseId,
        userId
      ]
    };

    const queryResult = await this.databaseService.queryOne<FnUnpublishCourseResult>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(
        queryResult?.message
      )
    }

    return ResponseUtil.success(
      queryResult.message,
      new UnpublishCourseResponseEntity({
        courseId: queryResult.data?.courseId,
        status: queryResult.data?.status
      })
    )
  }

  async creteDraft(courseId: string, userId: string): Promise<ApiResponse> {

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_create_draft($1, $2)`,
      params: [
        courseId,
        userId
      ]
    };

    const queryResult = await this.databaseService.queryOne<FnCreateDraftCourseResult>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(
        queryResult?.message
      )
    }

    return ResponseUtil.success(
      queryResult.message,
      new CreateDraftResponseEntity({
        courseId: queryResult.data?.courseId,
        status: queryResult.data?.status
      })
    )
  }
}
