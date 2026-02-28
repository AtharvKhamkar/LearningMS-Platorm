import { ApiResponse, AppJwtService, DatabaseService, FnGetUserProfileDetails, IPgQuery, IUserDb, ResponseUtil, StorageService } from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FnUpdateUserCoverImage, FnUpdateUserFcmToken, FnUpdateUserProfileDetails, FnUpdateUserProfileImage } from './types';
import { ProfileResponseMapper } from './mappers';
import { UpdateFcmToken, UpdateProfileDto } from './dtos';
import { ProfileResponseEntity } from './entities';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: AppJwtService,
    private readonly storageService: StorageService
  ) { }

  async getProfile(userId: string): Promise<ApiResponse> {

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_get_user_profile_details($1)`,
      params: [
        userId
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnGetUserProfileDetails<IUserDb>>(pgQuery);

    if (!queryResult?.success || !queryResult?.data) {
      throw new BadRequestException(queryResult?.message);
    }

    const user: IUserDb = queryResult?.data;

    //fetch signed profile , cover image urls.
    const [profileImageUrl, coverImageUrl] = await Promise.all([
      await this.storageService.getSignedFileUrl(user.profile_image),
      await this.storageService.getSignedFileUrl(user.cover_image)
    ]);

    return ResponseUtil.success(
      'User profile fetched successfully.',
      new ProfileResponseEntity({
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        countryName: user.country_name,
        languageName: user.language_name,
        phoneNumber: user.phone_number,
        profileImage: profileImageUrl,
        coverImage: coverImageUrl,
        bioGraphy: user.biography,
        role: user.role,
        isVerified: user.is_verified,
        fcmToken: user.fcm_token,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      })
    )
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<ApiResponse> {

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_update_user_profile_details($1, $2, $3, $4, $5, $6, $7)`,
      params: [
        userId,
        dto.firstName,
        dto.lastName,
        dto.countryCodeId,
        dto.languageId,
        dto.phoneNumber,
        dto.biography
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnUpdateUserProfileDetails>(pgQuery);

    if (!queryResult?.success) {
      throw new BadRequestException(queryResult?.message);
    }

    return ResponseUtil.success(
      'User profile updated successfully.',
    )
  }

  async updateProfileImage(userId: string, file: Express.Multer.File): Promise<ApiResponse> {

    const key = await this.storageService.uploadFile(file);

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_update_user_profile_image($1, $2)`,
      params: [
        userId,
        key
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnUpdateUserProfileImage>(pgQuery);

    if (!queryResult?.success || !queryResult?.data) {
      throw new BadRequestException(queryResult?.message);
    }

    const profileImageUrl = await this.storageService.getSignedFileUrl(queryResult?.data?.key);

    return ResponseUtil.success(
      'User profile Image updated successfully.',
      profileImageUrl
    )
  }

  async updateCoverImage(userId: string, file: Express.Multer.File): Promise<ApiResponse> {

    const key = await this.storageService.uploadFile(file);

    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_update_user_cover_image($1, $2)`,
      params: [
        userId,
        key
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnUpdateUserCoverImage>(pgQuery);

    if (!queryResult?.success || !queryResult.data) {
      throw new BadRequestException(queryResult?.message);
    }

    const coverImageUrl = await this.storageService.getSignedFileUrl(queryResult.data?.key);

    return ResponseUtil.success(
      'User Cover Image updated successfully.',
      coverImageUrl
    )
  }

  async updateDevice(userId: string, dto: UpdateFcmToken): Promise<ApiResponse> {
    const pgQuery: IPgQuery = {
      query: `SELECT * FROM fn_update_user_fcm_token($1, $2)`,
      params: [
        userId,
        dto.fcmToken
      ]
    }

    const queryResult = await this.databaseService.queryOne<FnUpdateUserFcmToken>(pgQuery);

    if (!queryResult?.success || !queryResult.data) {
      throw new BadRequestException(queryResult?.message);
    }


    return ResponseUtil.success(
      'User Device Updated Successfully.',
    )
  }
}
