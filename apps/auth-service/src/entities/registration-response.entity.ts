import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseEntity {
    @ApiProperty({ example: 'dc4ddd44-6e4d-46d7-aaae-930288a11d52' })
    userId: string;

    @ApiProperty({ example: false })
    isVerified: boolean;

    constructor(partial: Partial<RegistrationResponseEntity>) {
        Object.assign(this, partial);
    }
}
