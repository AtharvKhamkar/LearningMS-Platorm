import { NestFactory } from '@nestjs/core';
import { EnrollmentServiceModule } from './enrollment-service.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EnrollmentServiceModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupSwagger({ app: app, title: 'Enrollment Service', description: 'Enrollment Service Decription', apiVersion: '1.0', route: 'api' });

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
