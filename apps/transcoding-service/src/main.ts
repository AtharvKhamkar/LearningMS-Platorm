import { NestFactory } from '@nestjs/core';
import { TranscodingServiceModule } from './transcoding-service.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(TranscodingServiceModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupSwagger({ app: app, title: 'Transcoding Service', description: 'Transcoding Service Decription', apiVersion: '1.0', route: 'api' });

  await app.listen(process.env.port ?? 3004);
}
bootstrap();
