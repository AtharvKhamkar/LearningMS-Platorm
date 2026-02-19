import { Body, Controller, Get, Patch, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guards';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, ImageUploadPipe } from '@app/common';
import type { JwtPayload } from '@app/common';
import { ProfileResponseEntity } from './entities';
import { UpdateCoverImageDto, UpdateFcmToken, UpdateProfileDto, UpdateProfileImageDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/user')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)

export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) { }

  @Get('/get-profile')
  @ApiOkResponse({ type: ProfileResponseEntity })
  async GetProfile(@CurrentUser() user: JwtPayload) {
    const userId = user.sub;
    return this.userManagementService.getProfile(userId);
  }

  @Put('/update-profile')
  @ApiAcceptedResponse({ type: ApiResponse })
  async UpdateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    const userId = user.sub;
    return this.userManagementService.updateProfile(userId, dto);
  }

  @Patch('/update-profile-image')
  @ApiAcceptedResponse({ type: ApiResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileImageDto })
  @UseInterceptors(FileInterceptor('file'))
  async UpdateProfileImage(@CurrentUser() user: JwtPayload, @UploadedFile(ImageUploadPipe) file: Express.Multer.File) {
    const userId = user.sub;
    return this.userManagementService.updateProfileImage(userId, file);
  }

  @Patch('/update-cover-image')
  @ApiAcceptedResponse({ type: ApiResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCoverImageDto })
  @UseInterceptors(FileInterceptor('file'))
  async UpdateCoverImage(@CurrentUser() user: JwtPayload, @UploadedFile(ImageUploadPipe) file: Express.Multer.File) {
    const userId = user.sub;
    return this.userManagementService.updateCoverImage(userId, file);
  }

  @Patch('/update-device')
  @ApiAcceptedResponse({ type: ApiResponse })
  async UpdateDevice(@CurrentUser() user: JwtPayload, @Body() dto: UpdateFcmToken) {
    const userId = user.sub;
    return this.userManagementService.updateDevice(userId, dto);
  }
}
