import { NestFactory, Reflector } from '@nestjs/core';
import { UserManagementServiceModule } from './user-management.module';
import { ValidationPipe } from '@nestjs/common';
import { PermissionsGuard, setupSwagger } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UserManagementServiceModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupSwagger({ app: app, title: 'User Management Service', description: 'User Management Service Decription', apiVersion: '1.0', route: 'api' });

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
