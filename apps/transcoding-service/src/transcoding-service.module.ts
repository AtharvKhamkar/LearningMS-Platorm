import { Module } from '@nestjs/common';
import { TranscodingServiceController } from './transcoding-service.controller';
import { TranscodingServiceService } from './transcoding-service.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [HealthController,TranscodingServiceController],
  providers: [TranscodingServiceService],
})
export class TranscodingServiceModule {}
