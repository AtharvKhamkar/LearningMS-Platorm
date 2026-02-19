import { NestFactory } from '@nestjs/core';
import { CourseServiceModule } from './course-service.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CourseServiceModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  setupSwagger({ app: app, title: 'Course Service', description: 'Course Service Decription', apiVersion: '1.0', route: 'api' });
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
