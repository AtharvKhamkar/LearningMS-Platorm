import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourseServiceService } from './course-service.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { CreateCourseDto } from './dtos';
import { CheckPermissions, CurrentUser, ImageUploadPipe, JwtAuthGuard, Permissions, PermissionsGuard } from '@app/common';
import type { JwtPayload } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCourseResponseEntity } from './entities';

@Controller('/course')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CourseServiceController {
  constructor(private readonly courseServiceService: CourseServiceService) { }

  @CheckPermissions(Permissions.COURSE_CREATE)
  @Post('/create')
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
    return this.courseServiceService.create(userId, thumbnail, dto);
  }
}
