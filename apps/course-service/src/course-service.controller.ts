import { Controller, Get } from '@nestjs/common';
import { CourseServiceService } from './course-service.service';

@Controller()
export class CourseServiceController {
  constructor(private readonly courseServiceService: CourseServiceService) {}

  @Get()
  getHealth(): string {
    return this.courseServiceService.getHealth();
  }
}
