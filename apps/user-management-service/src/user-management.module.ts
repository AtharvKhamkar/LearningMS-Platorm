import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { AppJwtModule, DatabaseModule, PermissionsGuard, rabbitmqConfig, storageConfig, StorageModule } from '@app/common';
import { RabbitMQModule } from '@app/common/infrastructure/queues/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppJwtModule,
    DatabaseModule,
    RabbitMQModule,
    StorageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, storageConfig]
    }),
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService, PermissionsGuard],
})
export class UserManagementServiceModule { }
