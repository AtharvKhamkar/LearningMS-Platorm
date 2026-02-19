import { Module } from '@nestjs/common';
import { CourseServiceController } from './course-service.controller';
import { CourseServiceService } from './course-service.service';
import { ConfigModule } from '@nestjs/config';
import { rabbitmqConfig, storageConfig } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, storageConfig]
    }),
  ],
  controllers: [CourseServiceController],
  providers: [CourseServiceService],
})
export class CourseServiceModule { }
