import { Module } from '@nestjs/common';
import { MailWorkerController } from './mail-worker.controller';
import { MailWorkerService } from './mail-worker.service';
import { TemplateRendererService } from './template-renderer.service';
import { SMTPService } from './smtp.service';
import { ConfigModule } from '@nestjs/config';
import { mailConfig, storageConfig } from '@app/common';

@Module({
  imports: [
    //Config modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailConfig, storageConfig]
    }),
    
  ],
  controllers: [MailWorkerController],
  providers: [MailWorkerService, TemplateRendererService, SMTPService],
})
export class MailWorkerModule {}
