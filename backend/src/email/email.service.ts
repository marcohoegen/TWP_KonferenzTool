import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly userService: UserService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // Method to send a single "code-mail" to a specific user by entering their email address
  async sendOneCodeByEmail(user: any) {
    const info = await this.transporter.sendMail({
      from: `"Confeed" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Confeed Login Code',
      html: `<b>Your personal Confeed login code to rate presentations is: ${user.code}</b>`,
    });
    await this.userService.updateCodeSentAt(user.id);
    console.log('Code mail sent to %s: %s', user.email, info.messageId);
  }

  // Method to send a single "code-mail" to a specific user by entering their userId
  async sendOneCodeByUserId(userId: number) {
    const user = await this.userService.findCodeByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const info = await this.transporter.sendMail({
      from: `"Confeed" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Confeed Login Code',
      html: `<b>Your personal Confeed login code to rate presentations is: ${user.code}</b>`,
    });
    await this.userService.updateCodeSentAt(user.id);
    console.log('Code mail sent to %s: %s', user.email, info.messageId);
  }
}
