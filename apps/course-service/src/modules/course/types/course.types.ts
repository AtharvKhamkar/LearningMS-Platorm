import { ApiResponse } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }


export enum CourseLevel {
    beginner = 'BEGINNER',
    intermediate = 'INTERMEDIATE',
    advanced = 'ADVANCED',
    allLevels = 'ALL_LEVELS'
}

export enum CourseStatus {
    draft = 'DRAFT',
    review = 'REVIEW',
    published = 'PUBLISHED',
    archived = 'ARCHIVED'
}

export type FnCreateCourseResult = ISqlFnResult<{
    courseId: string;
    status: CourseStatus;
}>;

export type FnUpdateCourseResult = ISqlFnResult<{
    courseId: string;
    status: CourseStatus;
}>;

export type FnUpdateCourseThumbnailResult = ISqlFnResult<{
    courseId: string;
    status: CourseStatus;
    oldThumbnailKey: string
    updatedThumbnailKey: string
}>;

export type FnPublishCourseResult = ISqlFnResult<{
    courseId: string;
    status: CourseStatus;
}>;

export type FnUnpublishCourseResult = ISqlFnResult<{
    courseId: string;
    status: CourseStatus;
}>;

export type FnCreateDraftCourseResult = ISqlFnResult<{
    courseId: string;
    status: CourseStatus;
}>;

export type FnGetCourseDetailsResult = ISqlFnResult<CourseDetails>;

export interface CourseDetails {
    courseId: string;
    category: {
        id: string;
        name: string;
    };
    subcategory: {
        id: string;
        name: string;
    };
    instructor: {
        id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    title: string;
    description: string;
    requirement?: string;
    courseLearning?: string;
    tags: string[];
    level: string;
    language: {
        id: string;
        name: string;
    }
    duration?: string;
    price: number;
    status: CourseStatus;
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export type FnSearchCourseResult = ISqlFnResult<CourseSearchData>;

export interface CourseSearchData {
    courses:    CourseDetails[];
    pagination: SearchPagination;
}

export interface SearchPagination {
    total: number;
    page:  number;
    limit: number;
}






