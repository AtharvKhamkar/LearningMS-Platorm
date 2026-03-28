import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CourseLevel } from '../types';

export class SearchCoursesDto {
    @ApiPropertyOptional({
        description: 'Full-text search across title, description, tags, and instructor name',
        example: 'JavaScript React'
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    @Transform(({ value }) => value?.trim())
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by category ID',
        example: 'c13ae1ed-02e8-44dc-8d11-48ebaf5f04f1'
    })
    @IsUUID()
    @IsOptional()
    categoryId?: string;

    @ApiPropertyOptional({
        description: 'Filter by subcategory ID',
        example: 'f32dcd79-b7e8-466b-b77c-eecaa20f4db8'
    })
    @IsUUID()
    @IsOptional()
    subcategoryId?: string;

    @ApiPropertyOptional({
        description: 'Filter by multiple tags (AND logic - course must have ALL tags)',
        example: ['javascript', 'react']
    })
    @IsArray()
    @IsString({ each: true })
    @MaxLength(50, { each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value.map((v: string) => v.trim().toLowerCase());
        if (typeof value === 'string') return value.split(',').map(v => v.trim().toLowerCase());
        return value;
    })
    tags?: string[];

    @ApiPropertyOptional({
        description: 'Filter by multiple course levels (OR logic)',
        enum: CourseLevel,
        example: ['BEGINNER', 'INTERMEDIATE']
    })
    @IsArray()
    @IsEnum(CourseLevel, { each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(',').map(v => v.trim());
        return value;
    })
    levels?: CourseLevel[];

    @ApiPropertyOptional({
        description: 'Filter by language ID',
        example: '694dcedf-ec52-4614-8cf6-a077b4d57e54'
    })
    @IsUUID()
    @IsOptional()
    languageId?: string;

    @ApiPropertyOptional({
        description: 'Minimum price filter',
        example: 0,
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    minPrice?: number;

    @ApiPropertyOptional({
        description: 'Maximum price filter',
        example: 200,
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    maxPrice?: number;

    @ApiPropertyOptional({
        description: 'Minimum duration filter (in minutes)',
        example: 60
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    minDuration?: number;

    @ApiPropertyOptional({
        description: 'Maximum duration filter (in minutes)',
        example: 600
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    maxDuration?: number;

    @ApiPropertyOptional({
        description: 'Field to sort by',
        enum: ['title', 'price', 'duration_minutes', 'created_at', 'updated_at', 'published_at'],
        example: 'created_at',
        default: 'created_at'
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.toLowerCase())
    sortBy?: 'title' | 'price' | 'duration_minutes' | 'created_at' | 'updated_at' | 'published_at';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        example: 'desc',
        default: 'desc'
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase())
    sortOrder?: 'ASC' | 'DESC';

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
        default: 1
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100,
        default: 10
    })
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    limit?: number;
}
