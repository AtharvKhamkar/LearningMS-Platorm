import { Body, Controller, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { CreateCourseDto, SearchCoursesDto, UpdateCourseThumbnail } from './dtos';
import { CheckPermissions, CurrentUser, ImageUploadPipe, JwtAuthGuard, Permissions, PermissionsGuard } from '@app/common';
import type { JwtPayload } from '@app/common';
import { CourseSearchResponseEntity, CreateCourseResponseEntity, CreateDraftResponseEntity, GetCourseDetailsResponseEntity, PublishCourseResponseEntity, UnpublishCourseResponseEntity } from './entities';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { UpdateCourseResponseEntity } from './entities/update-course-reponse.entity';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CourseService } from './course.service';

@Controller('/course')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @CheckPermissions(Permissions.COURSE_VIEW_ALL)
  @Get('search')
  @ApiOkResponse({ type: CourseSearchResponseEntity })
  async searchCourse(
    @Query() dto: SearchCoursesDto,
  ) {
    console.log('search API called');
    
    return this.courseService.searchCourse(dto);
  }

  @CheckPermissions(Permissions.COURSE_CREATE)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCourseDto })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOkResponse({ type: CreateCourseResponseEntity })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCourseDto,
    @UploadedFile(ImageUploadPipe) thumbnail: Express.Multer.File,
  ) {
    const userId = user.sub;
    return this.courseService.create(userId, thumbnail, dto);
  }

  @CheckPermissions(Permissions.COURSE_UPDATE)
  @Patch(':id')
  @ApiBody({ type: UpdateCourseDto })
  @ApiOkResponse({ type: UpdateCourseResponseEntity })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    const userId = user.sub;
    return this.courseService.update(userId, courseId, dto);
  }

  @CheckPermissions(Permissions.COURSE_UPDATE)
  @Post(':id/thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCourseThumbnail })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOkResponse({ type: CreateCourseResponseEntity })
  async updateThumbnail(
    @CurrentUser() user: JwtPayload,
    @Param('id') courseId: string,
    @UploadedFile(ImageUploadPipe) thumbnail: Express.Multer.File,
  ) {
    const userId = user.sub;
    return this.courseService.updateThumbnail(courseId, userId, thumbnail);
  }

  @CheckPermissions(Permissions.COURSE_PUBLISH)
  @Patch(':id/publish')
  @ApiOkResponse({ type: PublishCourseResponseEntity })
  async publish(
    @CurrentUser() user: JwtPayload,
    @Param('id') courseId: string,
  ) {
    const userId = user.sub;
    return this.courseService.publish(courseId, userId);
  }

  @CheckPermissions(Permissions.COURSE_UNPUBLISH)
  @Patch(':id/unpublish')
  @ApiOkResponse({ type: UnpublishCourseResponseEntity })
  async unpublish(
    @CurrentUser() user: JwtPayload,
    @Param('id') courseId: string,
  ) {
    const userId = user.sub;
    return this.courseService.unpublish(courseId, userId);
  }

  @CheckPermissions(Permissions.COURSE_UPDATE)
  @Patch(':id/draft')
  @ApiOkResponse({ type: CreateDraftResponseEntity })
  async createDraft(
    @CurrentUser() user: JwtPayload,
    @Param('id') courseId: string,
  ) {
    const userId = user.sub;
    return this.courseService.creteDraft(courseId, userId);
  }

  @CheckPermissions(Permissions.COURSE_VIEW_ALL)
  @Get(':id')
  @ApiOkResponse({ type: GetCourseDetailsResponseEntity })
  async getCourseDetails(
    @Param('id') courseId: string,
  ) {
    console.log('Details API called');
    
    return this.courseService.getCourseDetails(courseId);
  }
}
