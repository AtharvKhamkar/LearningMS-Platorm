import { Module } from '@nestjs/common';
import { CourseServiceController } from './course-service.controller';
import { CourseServiceService } from './course-service.service';
import { ConfigModule } from '@nestjs/config';
import { AppJwtModule, DatabaseModule, rabbitmqConfig, storageConfig, StorageModule } from '@app/common';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppJwtModule,
    DatabaseModule,
    StorageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, storageConfig]
    }),
  ],
  controllers: [HealthController, CourseServiceController],
  providers: [CourseServiceService],
})
export class CourseServiceModule { }
