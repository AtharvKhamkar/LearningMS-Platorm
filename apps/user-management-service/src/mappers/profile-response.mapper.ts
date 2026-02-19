import { IUserDb } from "@app/common";
import { ProfileResponseEntity } from "../entities";

export class ProfileResponseMapper {
    static toEntity(payload: IUserDb): ProfileResponseEntity {
        return new ProfileResponseEntity({
            id: payload.user_id,
            firstName: payload.first_name,
            lastName: payload.last_name ?? '',
            email: payload.email,
            phoneNumber: payload.phone_number ?? '',
            profileImage: payload.profile_image ?? '',
            coverImage: payload.cover_image ?? '',
            bioGraphy: payload.biography ?? '',
            role: payload.role,
            isVerified: payload.is_verified,
            fcmToken: payload.fcm_token ?? '',
            createdAt: payload.created_at,
            updatedAt: payload.updated_at
        });
    }
}