import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { AppJwtModule, DatabaseModule, rabbitmqConfig, storageConfig, StorageModule } from '@app/common';
import { RabbitMQModule } from '@app/common/infrastructure/queues/rabbitmq.module';
import { MailClientService } from './mail-client.service';

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
  controllers: [HealthController,AuthController],
  providers: [AuthService, MailClientService],
})
export class AuthServiceModule {}
