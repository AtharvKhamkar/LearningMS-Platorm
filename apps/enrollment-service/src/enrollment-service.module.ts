import { Module } from '@nestjs/common';
import { EnrollmentServiceController } from './enrollment-service.controller';
import { EnrollmentServiceService } from './enrollment-service.service';
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
  controllers: [EnrollmentServiceController],
  providers: [EnrollmentServiceService],
})
export class EnrollmentServiceModule { }
