import { ApiProperty } from "@nestjs/swagger";
import { CourseStatus } from "../types";

export class UpdateCourseThumbnailResponseEntity {
    @ApiProperty({ example: 'dc4ddd44-6e4d-46d7-aaae-930288a11d52' })
    courseId: string;

    @ApiProperty({ example: 'DRAFT' })
    status: CourseStatus;

    @ApiProperty({ example: 'https://cdn.app.com/profile.png' })
    thumbnailUrl: string;

    constructor(partial: Partial<UpdateCourseThumbnailResponseEntity>) {
        Object.assign(this, partial);
    }
}