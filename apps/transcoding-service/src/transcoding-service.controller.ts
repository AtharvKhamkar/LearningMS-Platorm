import { Controller, Get } from '@nestjs/common';
import { TranscodingServiceService } from './transcoding-service.service';

@Controller()
export class TranscodingServiceController {
  constructor(private readonly transcodingServiceService: TranscodingServiceService) {}

  @Get()
  getHello(): string {
    return this.transcodingServiceService.getHello();
  }
}
