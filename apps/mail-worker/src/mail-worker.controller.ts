import { Controller, Get, Logger } from '@nestjs/common';
import { MailWorkerService } from './mail-worker.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import * as mailTypes from '@app/common';


@Controller()
export class MailWorkerController {
  private readonly logger = new Logger(MailWorkerController.name);
  constructor(private readonly mailWorkerService: MailWorkerService) { }

  @EventPattern(mailTypes.MailQueueEvents.SEND_WELCOME)
  async handleWelcomeMail(
    @Payload() data: mailTypes.IWelcomeEmailEventPayload,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.mailWorkerService.sendWelcomeEmail(data)
      channel.ack(message);
    } catch (error) {
      this.logger.error(`ERROR :: MailController.handleWelcomeEmail :: ${error}`);
      channel.nack(message, false, true);
    }
  }


  @EventPattern(mailTypes.MailQueueEvents.FORGOT_PASSWORD)
  async handleForgotPasswordMail(
    @Payload() data: mailTypes.IForgotPasswordEmailEventPayload,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.mailWorkerService.sendForgotPasswordEmail(data)
      channel.ack(message);
    } catch (error) {
      this.logger.error(`ERROR :: MailController.handleForgotPasswordMail :: ${error}`);
      channel.nack(message, false, true);
    }

  }

  @EventPattern(mailTypes.MailQueueEvents.EMAIL_VERIFY)
  async handleEmailVerifyMail(
    @Payload() data: mailTypes.IEmailVerifyEmailEventPayload,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.mailWorkerService.sendEmailVerificationEmail(data)
      channel.ack(message);
    } catch (error) {
      this.logger.error(`ERROR :: MailController.handleEmailVerifyMail :: ${error}`);
      channel.nack(message, false, true);
    }

  }
}
