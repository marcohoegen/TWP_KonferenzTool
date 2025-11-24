import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
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

    async sendEmail(to: string, subject: string, text: string) {
        const info = await this.transporter.sendMail({
            from: `"Confeed" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html: `<b>This is a test email from Confeed.</b>`,
        });
        console.log('Message sent: %s', info.messageId);
    }
}
