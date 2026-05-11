import { ApiProperty } from '@nestjs/swagger';
import {

    IsNotEmpty,
    IsOptional,
    IsString,
    maxLength,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateCategoryDto {

    @ApiProperty({
        example: 'Developement',
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(1)
    name: string;

    @ApiProperty({
        example: 'This is developement category which consists all the courses related to the developmenet category',
        description: 'Category Description'
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    description: string;
}


