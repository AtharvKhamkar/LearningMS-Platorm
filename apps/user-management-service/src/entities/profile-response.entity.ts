import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponseEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty({required: false})
    lastName?: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    countryName: string;

    @ApiProperty()
    languageName: string;

    @ApiProperty({required: false})
    phoneNumber?: string;

    @ApiProperty({required: false})
    profileImage?: string;

    @ApiProperty({required: false})
    coverImage?: string;

    @ApiProperty({required: false})
    bioGraphy?: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    isVerified: boolean;

    @ApiProperty({required: false})
    fcmToken?: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    constructor(partial: Partial<ProfileResponseEntity>) {
        Object.assign(this, partial);
    }
}