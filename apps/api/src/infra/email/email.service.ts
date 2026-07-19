import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { config } from '@/app/config';
import {
  buildInvitationEmail,
  buildLogoutReminderEmail,
  buildWelcomeEmail,
  type InvitationEmailParams,
  type LogoutReminderEmailParams,
  type WelcomeEmailParams,
} from './templates';

/**
 * SMTP email sender for invitation + welcome.
 * Best-effort: failures are logged, never throw to callers unless sendAndThrow needed.
 */
export class EmailService {
  private transporter: Transporter | null = null;

  private getAppUrl(): string {
    return config.frontendUrl.replace(/\/$/, '');
  }

  private ensureTransporter(): Transporter | null {
    if (!config.email.enabled) {
      return null;
    }

    if (!config.email.smtp.host) {
      console.warn(
        '[email] EMAIL enabled but SMTP_HOST is empty — falling back to log mode'
      );
      return null;
    }

    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.secure,
        auth:
          config.email.smtp.user
            ? {
                user: config.email.smtp.user,
                pass: config.email.smtp.pass,
              }
            : undefined,
      });
    }

    return this.transporter;
  }

  private async dispatch(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<{ sent: boolean; mode: 'smtp' | 'log' }> {
    const transporter = this.ensureTransporter();

    if (!transporter) {
      console.log('[email:log]', {
        to: options.to,
        subject: options.subject,
        text: options.text,
      });
      return { sent: false, mode: 'log' };
    }

    try {
      await transporter.sendMail({
        from: config.email.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      console.log(`[email:smtp] sent to ${options.to}: ${options.subject}`);
      return { sent: true, mode: 'smtp' };
    } catch (error) {
      console.error('[email:smtp] failed:', error);
      // Best-effort: do not rethrow
      return { sent: false, mode: 'smtp' };
    }
  }

  /** Email thông báo lời mời (sau khi tạo invitation). */
  async sendInvitationEmail(
    params: Omit<InvitationEmailParams, 'appUrl'> & { appUrl?: string }
  ) {
    const payload = buildInvitationEmail({
      ...params,
      appUrl: params.appUrl ?? this.getAppUrl(),
    });
    return this.dispatch({
      to: params.toEmail,
      ...payload,
    });
  }

  /** Email welcome (sau khi accept invitation). */
  async sendWelcomeEmail(
    params: Omit<WelcomeEmailParams, 'appUrl'> & { appUrl?: string }
  ) {
    const payload = buildWelcomeEmail({
      ...params,
      appUrl: params.appUrl ?? this.getAppUrl(),
    });
    return this.dispatch({
      to: params.toEmail,
      ...payload,
    });
  }

  /** Email nhắc đăng xuất acc sau khi end session quá N phút. */
  async sendLogoutReminderEmail(
    params: Omit<LogoutReminderEmailParams, 'appUrl'> & { appUrl?: string }
  ) {
    const payload = buildLogoutReminderEmail({
      ...params,
      appUrl: params.appUrl ?? this.getAppUrl(),
    });
    return this.dispatch({
      to: params.toEmail,
      ...payload,
    });
  }
}

export const emailService = new EmailService();
