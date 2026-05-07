import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppJwtModule, DatabaseModule, rabbitmqConfig, storageConfig, StorageModule } from '@app/common';
import { HealthController } from 'apps/auth-service/src/health.controller';
import { CourseModule } from './modules/course/course.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    CourseModule,
    CategoryModule
  ],
  controllers: [HealthController],
  providers: [],
})
export class CourseServiceModule { }
