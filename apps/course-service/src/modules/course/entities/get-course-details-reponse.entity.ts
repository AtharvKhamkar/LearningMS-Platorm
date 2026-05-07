import { ApiProperty } from "@nestjs/swagger";

export class CourseCategoryEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    constructor(partial: Partial<CourseCategoryEntity>) {
        Object.assign(this, partial);
    }
}

export class CourseSubCategoryEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    constructor(partial: Partial<CourseSubCategoryEntity>) {
        Object.assign(this, partial);
    }
}

export class CourseInstructorEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ required: false })
    profileImage?: string | null;

    constructor(partial: Partial<CourseInstructorEntity>) {
        Object.assign(this, partial);
    }
}

export class CourseLanguageEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    constructor(partial: Partial<CourseLanguageEntity>) {
        Object.assign(this, partial)
    }
}

export class GetCourseDetailsResponseEntity {
    @ApiProperty()
    courseId: string;

    @ApiProperty({ type: CourseCategoryEntity })
    category: CourseCategoryEntity;

    @ApiProperty({ type: CourseSubCategoryEntity })
    subcategory: CourseSubCategoryEntity;

    @ApiProperty({ type: CourseInstructorEntity })
    instructor: CourseInstructorEntity;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ required: false })
    requirement?: string | null;

    @ApiProperty({ required: false })
    courseLearning?: string | null;

    @ApiProperty()
    tags: string[];

    @ApiProperty()
    level: string;

    @ApiProperty({ type: CourseLanguageEntity })
    language: CourseLanguageEntity;

    @ApiProperty({ required: false })
    duration?: string | null;

    @ApiProperty()
    price: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    thumbnail: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty({ required: false })
    publishedAt?: string | null;

    constructor(partial: Partial<GetCourseDetailsResponseEntity>) {
        Object.assign(this, partial);
    }

}