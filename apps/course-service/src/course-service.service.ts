import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseServiceService {
  getHealth(): string {
    return 'API Working';
  }
}
