import { INotificationData } from 'erxes-api-shared/core-modules';

// Email transport configuration
export interface IEmailTransportConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  ses?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  sendgrid?: {
    apiKey: string;
  };
}

// BullMQ job data structure
export interface INotificationJobData {
  subdomain: string;
  data: { userIds: string[] } & INotificationData;
}
