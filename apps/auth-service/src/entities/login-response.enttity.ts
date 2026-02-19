import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseEntity {
    @ApiProperty({ example: 'atharv@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Atharv' })
    firstName: string;

    @ApiProperty({ example: 'Khamkar' })
    lastName?: string | null;

    @ApiProperty({ example: 'e819951e-eca1-49b5-9e2d-2e9b08208d6f' })
    countryCodeId: string;

    @ApiProperty({ example: '+919876543210' })
    phoneNumber?: string | null;

    @ApiProperty({ example: 'atharv@gmail.com' })
    languageId: string;

    @ApiProperty({ example: 'https://cdn.app.com/cover.png' })
    profileImage?: string | null;

    @ApiProperty({ example: 'https://cdn.app.com/profile.png' })
    coverImage: string | null;

    @ApiProperty({ example: 'This is biography.' })
    biography: string | null;

    @ApiProperty({ example: 'STUDENT' })
    role: string;

    @ApiProperty({ example: true })
    isVerified: boolean;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4YmNlOS0yNzYwLTQxODktYjk3Yy1hNDlmYTc4NDc0NTMiLCJlbWFpbCI6ImF0aGFydkBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJBdGhhcnYiLCJsYXN0TmFtZSI6IktoYW1rYXIiLCJyb2xlIjoiU1RVREVOVCIsInBob25lTnVtYmVyIjoiKzkxOTg3NjU0MzIxMCIsImlhdCI6MTc2OTI2Njk4MiwiZXhwIjoxNzY5MjcwNTgyfQ.54SImff0QcBw5i3-r1avI5_ykLhRGohhgcol8brtmvw' })
    accessToken: string;

    constructor(partial: Partial<LoginResponseEntity>) {
        Object.assign(this, partial);
    }
}