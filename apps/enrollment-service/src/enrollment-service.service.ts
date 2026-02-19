import { Injectable } from '@nestjs/common';

@Injectable()
export class EnrollmentServiceService {
  getHealth(): string {
    return 'API Working!';
  }
}
