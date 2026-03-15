import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('app.smtp.user'),
        pass: this.configService.get<string>('app.smtp.pass'),
      },
    });
  }

  private get fromEmail(): string {
    return `"Mealio" <${this.configService.get<string>('app.smtp.user')}>`;
  }

  private get frontendUrl(): string {
    return this.configService.get<string>(
      'app.frontendUrl',
      'http://localhost:5173',
    );
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: email,
      subject: 'Verify your Mealio account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #16a34a; margin: 0;">Mealio</h1>
          </div>
          <div style="background: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h2 style="margin-top: 0; color: #111827;">Verify your email</h2>
            <p style="color: #6b7280;">Thanks for signing up! Please verify your email address by clicking the button below.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyUrl}" style="background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Verify Email</a>
            </div>
            <p style="color: #9ca3af; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: email,
      subject: 'Reset your Mealio password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #16a34a; margin: 0;">Mealio</h1>
          </div>
          <div style="background: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h2 style="margin-top: 0; color: #111827;">Reset your password</h2>
            <p style="color: #6b7280;">We received a request to reset your password. Click the button below to choose a new password.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #9ca3af; font-size: 13px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });
  }
}
