import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponseEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty({required: false})
    lastName?: string | null;

    @ApiProperty()
    email: string;

    @ApiProperty()
    countryName: string;

    @ApiProperty()
    languageName: string;

    @ApiProperty({required: false})
    phoneNumber?: string | null;

    @ApiProperty({required: false})
    profileImage?: string | null;

    @ApiProperty({required: false})
    coverImage?: string | null;

    @ApiProperty({required: false})
    bioGraphy?: string | null;

    @ApiProperty()
    role: string;

    @ApiProperty()
    isVerified: boolean;

    @ApiProperty({required: false})
    fcmToken?: string | null;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    constructor(partial: Partial<ProfileResponseEntity>) {
        Object.assign(this, partial);
    }
}