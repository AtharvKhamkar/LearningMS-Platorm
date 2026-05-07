import { Module } from '@nestjs/common';
import { CourseService} from './course.service';
import { ConfigModule } from '@nestjs/config';
import { AppJwtModule, DatabaseModule, rabbitmqConfig, storageConfig, StorageModule } from '@app/common';
import { CourseController } from './course.controller';

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
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
