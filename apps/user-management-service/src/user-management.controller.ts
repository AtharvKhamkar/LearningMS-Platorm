import { Body, Controller, Get, Patch, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { CheckPermissions, CurrentUser, ImageUploadPipe, PermissionsGuard } from '@app/common';
import type { JwtPayload } from '@app/common';
import { ProfileResponseEntity } from './entities';
import { UpdateCoverImageDto, UpdateFcmToken, UpdateProfileDto, UpdateProfileImageDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { Permissions } from '@app/common/rbac/permissions';

@Controller('/user')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)

export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) { }

  @CheckPermissions(Permissions.USER_VIEW)
  @Get('/get-profile')
  @ApiOkResponse({ type: ProfileResponseEntity })
  async GetProfile(@CurrentUser() user: JwtPayload) {
    const userId = user.sub;
    return this.userManagementService.getProfile(userId);
  }

  @CheckPermissions(Permissions.USER_UPDATE_PROFILE)
  @Put('/update-profile')
  @ApiAcceptedResponse({ type: ApiResponse })
  async UpdateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    const userId = user.sub;
    return this.userManagementService.updateProfile(userId, dto);
  }

  @CheckPermissions(Permissions.USER_UPDATE_PROFILE)
  @Patch('/update-profile-image')
  @ApiAcceptedResponse({ type: ApiResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileImageDto })
  @UseInterceptors(FileInterceptor('file'))
  async UpdateProfileImage(@CurrentUser() user: JwtPayload, @UploadedFile(ImageUploadPipe) file: Express.Multer.File) {
    const userId = user.sub;
    return this.userManagementService.updateProfileImage(userId, file);
  }

  @CheckPermissions(Permissions.USER_UPDATE_PROFILE)
  @Patch('/update-cover-image')
  @ApiAcceptedResponse({ type: ApiResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCoverImageDto })
  @UseInterceptors(FileInterceptor('file'))
  async UpdateCoverImage(@CurrentUser() user: JwtPayload, @UploadedFile(ImageUploadPipe) file: Express.Multer.File) {
    const userId = user.sub;
    return this.userManagementService.updateCoverImage(userId, file);
  }

  @CheckPermissions(Permissions.USER_UPDATE_PROFILE)
  @Patch('/update-device')
  @ApiAcceptedResponse({ type: ApiResponse })
  async UpdateDevice(@CurrentUser() user: JwtPayload, @Body() dto: UpdateFcmToken) {
    const userId = user.sub;
    return this.userManagementService.updateDevice(userId, dto);
  }
}
