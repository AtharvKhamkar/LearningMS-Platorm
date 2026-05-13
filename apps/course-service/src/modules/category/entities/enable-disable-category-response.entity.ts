import { ApiProperty } from '@nestjs/swagger';

export class EnableDisableCategoryResponseDto {
    @ApiProperty({ example: 'dc4ddd44-6e4d-46d7-aaae-930288a11d52' })
    categoryId: string;

    @ApiProperty({example: false})
    isDisabled: boolean

    constructor(partial: Partial<EnableDisableCategoryResponseDto>) {
        Object.assign(this, partial);
    }
}
