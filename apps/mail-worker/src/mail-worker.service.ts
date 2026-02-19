import { Inject, Injectable, Logger } from '@nestjs/common';
import { SMTPService } from './smtp.service';
import { TemplateRendererService } from './template-renderer.service';
import { IEmailVerifyEmailEventPayload, IForgotPasswordEmailEventPayload, IWelcomeEmailEventPayload } from '@app/common';
import { TemplatesRendererOptions } from './types/mail.types';

@Injectable()
export class MailWorkerService {
  private readonly logger = new Logger(MailWorkerService.name);

  constructor(
    private readonly smtpService: SMTPService,
    private readonly renderer: TemplateRendererService
  ) { }

  async sendWelcomeEmail(emailPayload: IWelcomeEmailEventPayload) {
    const contentOptions: TemplatesRendererOptions = {
      templateName: 'welcome.html',
      variables: {
        email: emailPayload.email,
        name: emailPayload.name
      }
    }
    const html = await this.renderer.render(contentOptions);

    await this.smtpService.send({
      to: emailPayload.email,
      subject: 'Welcome email',
      html: html
    })

    this.logger.log(`Welcome email send to ${emailPayload.email}`)
  }


  async sendForgotPasswordEmail(emailPayload: IForgotPasswordEmailEventPayload) {
    const contentOptions: TemplatesRendererOptions = {
      templateName: 'forgotpassword.html',
      variables: {
        email: emailPayload.email,
        name: emailPayload.name,
        otp: emailPayload.otp,
        expiresAt: emailPayload.expiresAt
      }
    }
    const html = await this.renderer.render(contentOptions);

    await this.smtpService.send({
      to: emailPayload.email,
      subject: 'Forgot Password',
      html: html
    })

    this.logger.log(`Forgot Password email send to ${emailPayload.email}`)
  }

  async sendEmailVerificationEmail(emailPayload: IEmailVerifyEmailEventPayload) {
    const contentOptions: TemplatesRendererOptions = {
      templateName: 'emailverify.html',
      variables: {
        email: emailPayload.email,
        name: emailPayload.name,
        otp: emailPayload.otp,
        expiresAt: emailPayload.expiresAt
      }
    }
    const html = await this.renderer.render(contentOptions);

    await this.smtpService.send({
      to: emailPayload.email,
      subject: 'Email Verification',
      html: html
    })

    this.logger.log(`Email Verification email send to ${emailPayload.email}`)
  }
}
