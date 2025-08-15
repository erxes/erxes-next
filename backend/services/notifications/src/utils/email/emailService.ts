import { IEmailTransportConfig } from '@/types';
import { debugError, debugInfo } from '@/utils/debugger';
import { getEnv, sendTRPCMessage } from 'erxes-api-shared/utils';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import {
  createTransporter,
  generateFromEmail,
  getUserDetail,
} from './emailUtils';
import { IUserDocument } from 'erxes-api-shared/core-types';
import { MailService } from '@sendgrid/mail';
import { Transporter } from 'nodemailer';

export class EmailService {
  private async readFile(filename: string) {
    const filePath = path.resolve(
      __dirname,
      `../../private/emailTemplates/${filename}.html`,
    );
    return fs.promises.readFile(filePath, 'utf8');
  }

  private async applyTemplate(data: any, templateName: string) {
    let template: any = await this.readFile(templateName);

    template = Handlebars.compile(template.toString());

    return template(data);
  }

  private async getEmailConfig(): Promise<IEmailTransportConfig> {
    try {
      const configs = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'configs',
        action: 'getConfigs',
        input: {},
        defaultValue: {},
      });

      const DEFAULT_EMAIL_SERVICE =
        configs['DEFAULT_EMAIL_SERVICE'] || 'SENDGRID';

      if (DEFAULT_EMAIL_SERVICE === 'SENDGRID') {
        return {
          sendgrid: {
            apiKey: getEnv({ name: 'SENDGRID_API_KEY' }),
          },
        };
      }

      if (DEFAULT_EMAIL_SERVICE === 'SES') {
        return {
          ses: {
            accessKeyId: getEnv({ name: 'AWS_SES_ACCESS_KEY_ID' }),
            secretAccessKey: getEnv({ name: 'AWS_SES_SECRET_ACCESS_KEY' }),
            region: getEnv({ name: 'AWS_REGION', defaultValue: 'us-east-1' }),
          },
        };
      }

      // SMTP fallback
      return {
        service: configs['MAIL_SERVICE'],
        host: configs['MAIL_HOST'],
        port: parseInt(configs['MAIL_PORT']) || 587,
        secure: configs['MAIL_PORT'] === '465',
        auth: {
          user: configs['MAIL_USER'],
          pass: configs['MAIL_PASS'],
        },
      };
    } catch (error) {
      debugError('Failed to get email config', error);
      throw new Error('Failed to get email configuration');
    }
  }

  private async getFromEmail(): Promise<string> {
    try {
      const configs = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'configs',
        action: 'getConfigs',
        input: {},
        defaultValue: {},
      });

      const COMPANY_EMAIL_FROM = configs['COMPANY_EMAIL_FROM'];

      return COMPANY_EMAIL_FROM || 'noreply@erxes.io';
    } catch (error) {
      debugError('Failed to get from email', error);
      return 'noreply@erxes.io';
    }
  }

  public async sendNotificationEmail(notificationData: {
    toEmail: string;
    user: IUserDocument;
    notificationId?: string;
    title: string;
    message: string;
    contentType: string;
    emailSubject?: string;
    emailTemplateId?: string;
    metadata?: any;
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    subject: string;
    content: string;
    provider: string;
  }> {
    try {
      // Get email configuration
      const emailConfig = await this.getEmailConfig();
      const transporter = await createTransporter(emailConfig);

      // Get sender email
      const fromEmail = await this.getFromEmail();

      const DOMAIN = getEnv({ name: 'DOMAIN' });

      const html = await this.applyTemplate(
        {
          notification: {
            title: notificationData.title,
            content: notificationData.message,
            link: `${DOMAIN}/my-inbox/${notificationData.notificationId}`,
            date: new Date().toISOString(),
          },
          userName: getUserDetail(notificationData.user),
        },
        'notification',
      );

      debugInfo(`Sending notification email to ${notificationData.toEmail}`);
      const from = generateFromEmail('Notification Service', fromEmail);
      if (!from) {
        throw new Error('Cannot find from email');
      }

      const mailOptions = {
        from,
        to: notificationData.toEmail,
        subject: 'Notification',
        html,
      };

      let info;

      if (emailConfig.sendgrid) {
        info = await (transporter as MailService).send(mailOptions);
      } else {
        info = await (transporter as Transporter).sendMail(mailOptions);
      }

      debugInfo(`Email sent successfully`, {
        messageId: info.messageId,
        toEmail: notificationData.toEmail,
      });

      return {
        success: true,
        messageId: info.messageId,
        subject: 'Notification',
        content: html,
        provider: emailConfig.service || (emailConfig.ses ? 'ses' : 'smtp'),
      };
    } catch (error) {
      debugError('Email service error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        subject: notificationData.emailSubject || notificationData.title,
        content: notificationData.message,
        provider: 'unknown',
      };
    }
  }
}
