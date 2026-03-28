import { ApiProperty} from "@nestjs/swagger";
import type { CourseDetails, SearchPagination } from "../types";
import { GetCourseDetailsResponseEntity } from "./get-course-details-reponse.entity";



export class CourseDetailsEntity extends GetCourseDetailsResponseEntity {
    constructor(partial: Partial<CourseDetailsEntity>) {
        super(partial);
    }
}

export class PaginationEntity {
    @ApiProperty({ example: 84 }) total: number;
    @ApiProperty({ example: 1 }) page: number;
    @ApiProperty({ example: 10 }) limit: number;

    constructor(partial: Partial<PaginationEntity>) {
        Object.assign(this, partial);
    }
}

export class CourseSearchResponseEntity {
    @ApiProperty({ type: CourseDetailsEntity })
    courses: CourseDetails[];


    @ApiProperty({ type: PaginationEntity })
    pagination: SearchPagination;

    constructor(partial: Partial<CourseSearchResponseEntity>) {
        Object.assign(this, partial)
    }
}

