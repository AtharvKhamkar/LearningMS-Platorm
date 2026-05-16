import { Module } from '@nestjs/common';
import { HealthController } from 'apps/auth-service/src/health.controller';
import { CourseModule } from './modules/course/course.module';
import { CategoryModule } from './modules/category/category.module';
import { LectureModule } from './modules/lecture/lecture.module';

@Module({
  imports: [
    CourseModule,
    CategoryModule,
    LectureModule
  ],
  controllers: [HealthController],
  providers: [],
})
export class CourseServiceModule { }
