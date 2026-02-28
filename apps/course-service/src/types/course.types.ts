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