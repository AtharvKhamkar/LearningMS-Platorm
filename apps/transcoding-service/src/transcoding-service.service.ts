import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscodingServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
