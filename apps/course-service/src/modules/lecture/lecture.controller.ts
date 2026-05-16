import { Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CheckPermissions, CurrentUser, JwtAuthGuard, Permissions, PermissionsGuard, VideoUploadPipe } from '@app/common';
import type { JwtPayload } from '@app/common';
import { LectureService } from './lecture.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('/lecture')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LectureController {
    constructor(private readonly lectureService: LectureService) { }

    @CheckPermissions(Permissions.COURSE_CREATE)
    @Post('/:lectureId/get-presign-url')
    @UseInterceptors(FileInterceptor('file'))
    async getLecturePresignUrl(
        @CurrentUser() user: JwtPayload,
        @Param('lectureId') lectureId: string,
        @UploadedFile(VideoUploadPipe) video: Express.Multer.File,
    ) {
        const userId = user.sub;
        return this.lectureService.getLecturePresignUrl(userId, lectureId, video);
    }

}
