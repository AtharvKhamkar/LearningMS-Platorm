import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter, setupSwagger } from '@app/common';
import { GlobalResponseInterceptor } from '@app/common/interceptor/global-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger({ app: app, title: 'Auth Service', description: 'Auth Service Decription', apiVersion: '1.0', route: 'api' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
