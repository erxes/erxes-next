import { 
  getEnv, 
  sendTRPCMessage 
} from 'erxes-api-shared/utils';
import { IEmailTransportConfig } from '@/types';
import { createTransporter, generateFromEmail } from './emailUtils';
import { debugError, debugInfo } from '@/utils/debugger';
import { DEFAULT_EMAIL_TEMPLATES } from '@/constants';

export class EmailService {
  private async getEmailConfig(subdomain: string): Promise<IEmailTransportConfig> {
    try {
      const configs = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'configs',
        action: 'getConfigs',
        input: {},
        defaultValue: {},
      });

      const DEFAULT_EMAIL_SERVICE = configs['DEFAULT_EMAIL_SERVICE'] || 'SENDGRID';
      
      if (DEFAULT_EMAIL_SERVICE === 'SENDGRID') {
        return {
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: getEnv({ name: 'SENDGRID_API_KEY' }),
          }
        };
      }
      
      if (DEFAULT_EMAIL_SERVICE === 'SES') {
        return {
          ses: {
            accessKeyId: getEnv({ name: 'AWS_SES_ACCESS_KEY_ID' }),
            secretAccessKey: getEnv({ name: 'AWS_SES_SECRET_ACCESS_KEY' }),
            region: getEnv({ name: 'AWS_REGION', defaultValue: 'us-east-1' }),
          }
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
        }
      };
    } catch (error) {
      debugError('Failed to get email config', error);
      throw new Error('Failed to get email configuration');
    }
  }

  private async getFromEmail(subdomain: string): Promise<string> {
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
      const DEFAULT_AWS_EMAIL = getEnv({ name: 'DEFAULT_AWS_EMAIL' });

      return COMPANY_EMAIL_FROM || DEFAULT_AWS_EMAIL || 'no-reply@example.com';
    } catch (error) {
      debugError('Failed to get from email', error);
      return 'no-reply@example.com';
    }
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processed = processed.replace(regex, String(value || ''));
    }

    return processed;
  }

  private async getEmailTemplate(templateId?: string): Promise<{ subject: string; content: string }> {
    if (!templateId) {
      return DEFAULT_EMAIL_TEMPLATES.NOTIFICATION;
    }

    try {
      // In a real implementation, you would fetch from database
      // For now, return default template
      return DEFAULT_EMAIL_TEMPLATES.NOTIFICATION;
    } catch (error) {
      debugError('Failed to get email template', error);
      return DEFAULT_EMAIL_TEMPLATES.NOTIFICATION;
    }
  }

  public async sendNotificationEmail(
    subdomain: string, 
    notificationData: {
      toEmail: string;
      userId: string;
      notificationId?: string;
      title: string;
      message: string;
      contentType: string;
      emailSubject?: string;
      emailTemplateId?: string;
      metadata?: any;
    }
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    subject: string;
    content: string;
    provider: string;
  }> {
    try {
      // Get email configuration
      const emailConfig = await this.getEmailConfig(subdomain);
      const transporter = await createTransporter(emailConfig);
      
      // Get sender email
      const fromEmail = await this.getFromEmail(subdomain);
      
      // Get template
      const template = await this.getEmailTemplate(notificationData.emailTemplateId);
      
      // Process template with variables
      const variables = {
        title: notificationData.title,
        message: notificationData.message,
        contentType: notificationData.contentType,
        ...notificationData.metadata,
      };
      
      const processedSubject = this.processTemplate(
        notificationData.emailSubject || template.subject, 
        variables
      );
      const processedContent = this.processTemplate(
        template.content, 
        { ...variables, subject: notificationData.title, content: notificationData.message }
      );

      debugInfo(`Sending notification email to ${notificationData.toEmail}`);

      const mailOptions = {
        from: generateFromEmail('Notification Service', fromEmail),
        to: notificationData.toEmail,
        subject: processedSubject,
        html: processedContent,
      };

      const info = await transporter.sendMail(mailOptions);
      
      debugInfo(`Email sent successfully`, { messageId: info.messageId, toEmail: notificationData.toEmail });

      return {
        success: true,
        messageId: info.messageId,
        subject: processedSubject,
        content: processedContent,
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
