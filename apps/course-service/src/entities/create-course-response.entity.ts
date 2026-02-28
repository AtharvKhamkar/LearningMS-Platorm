import { ApiProperty } from '@nestjs/swagger';
import { CourseStatus } from '../types';

export class CreateCourseResponseEntity {
    @ApiProperty({ example: 'dc4ddd44-6e4d-46d7-aaae-930288a11d52' })
    courseId: string;

    @ApiProperty({ example: 'DRAFT' })
    status: CourseStatus;

    constructor(partial: Partial<CreateCourseResponseEntity>) {
        Object.assign(this, partial);
    }
}
