import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppJwtModule, DatabaseModule, rabbitmqConfig, storageConfig, StorageModule } from '@app/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppJwtModule,
    DatabaseModule,
    StorageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, storageConfig]
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
