import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationsService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {
    await this.resend.emails.send({
      from: this.configService.get('EMAIL_FROM') as string,
      to: email,
      subject: 'Sleepr Notification',
      text,
    });
  }
}
