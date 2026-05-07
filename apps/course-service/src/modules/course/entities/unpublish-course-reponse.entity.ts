import { ApiProperty } from "@nestjs/swagger";
import { CourseStatus } from "../types";

export class UnpublishCourseResponseEntity {
    @ApiProperty({ example: 'dc4ddd44-6e4d-46d7-aaae-930288a11d52' })
    courseId: string;

    @ApiProperty({ example: 'DRAFT' })
    status: CourseStatus;

    constructor(partial: Partial<UnpublishCourseResponseEntity>) {
        Object.assign(this, partial);
    }
}