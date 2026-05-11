import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryResponseDto {
    @ApiProperty({ example: 'dc4ddd44-6e4d-46d7-aaae-930288a11d52' })
    categoryId: string;

    constructor(partial: Partial<UpdateCategoryResponseDto>) {
        Object.assign(this, partial);
    }
}
