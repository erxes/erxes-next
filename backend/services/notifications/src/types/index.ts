// Core notification configuration for creating notifications
export interface INotificationData {
  // Core notification data
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';

  // Recipients
  userIds: string[];
  fromUserId?: string; // null for system notifications

  // Source information
  contentType: string; // 'frontline:conversation', 'sales:deal', etc.
  contentTypeId?: string; // ID of the source object
  action?: string; // 'assigned', 'resolved', etc.

  // Email configuration (if user wants email notifications)
  emailSubject?: string;
  emailTemplate?: string;

  // Additional options
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>; // Additional data
}

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
}

// BullMQ job data structure
export interface INotificationJobData {
  subdomain: string;
  data: INotificationData;
}
