import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    ArrayMaxSize,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CourseLevel } from '../types';

export class CreateCourseFormFieldsDto {

    @ApiProperty({
        example: 'c1b3d9d4-0c8b-4b8c-a4c9-6a01c1cdbb2d',
        description: 'Category ID to which the course belongs'
    })
    @IsUUID()
    categoryId: string;

    @ApiProperty({
        example: 'f32dcd79-b7e8-466b-b77c-eecaa20f4db8',
        description: 'Subcategory ID under the selected category'
    })
    @IsUUID()
    subcategoryId: string;

    @ApiProperty({
        example: 'NestJS Backend Masterclass',
        maxLength: 200,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @ApiProperty({
        example: '<p>Learn NestJS from scratch and build scalable backend systems.</p>',
        description: 'HTML content describing the course'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({
        example: '<ul><li>Basic JavaScript</li><li>Node.js fundamentals</li></ul>',
    })
    @IsString()
    @IsOptional()
    requirement?: string;

    @ApiPropertyOptional({
        example: '<ul><li>Build REST APIs</li><li>Work with PostgreSQL</li></ul>',
    })
    @IsString()
    @IsOptional()
    courseLearning?: string;

    @ApiPropertyOptional({ example: ['nestjs', 'backend'] })
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(10)
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').map(v => v.trim())
            : value
    )
    tags?: string[];

    @ApiProperty({
        example: CourseLevel.beginner,
        enum: CourseLevel,
    })
    @IsEnum(CourseLevel)
    level: CourseLevel;

    @ApiProperty({
        example: '694dcedf-ec52-4614-8cf6-a077b4d57e54',
        description: 'Language ID for the course'
    })
    @IsUUID()
    languageId: string;

    @ApiPropertyOptional({
        example: '02:30:00',
        description: 'Total duration of the course (HH:mm:ss). Optional during draft stage.'
    })
    @IsString()
    @IsOptional()
    duration?: string;

    @ApiPropertyOptional({
        example: 499.99,
        description: 'Course price. Defaults to 0 (free course).'
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    price?: number;
}


export class CreateCourseDto extends CreateCourseFormFieldsDto {
    @ApiProperty({
        example: 'courses/thumbnails/abc123.jpg',
        description: 'S3 object key of the course thumbnail',
        type: 'string',
        format: 'binary',
    })
    thumbnail: any;
}

