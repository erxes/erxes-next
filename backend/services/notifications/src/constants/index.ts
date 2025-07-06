export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms', 
  PUSH: 'push',
  IN_APP: 'in_app',
} as const;

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const NOTIFICATION_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  DELIVERED: 'delivered',
  BOUNCED: 'bounced',
  REJECTED: 'rejected',
} as const;

export const EMAIL_SERVICES = {
  SES: 'SES',
  SMTP: 'SMTP',
  SENDGRID: 'SendGrid',
  MAILGUN: 'Mailgun',
} as const;

export const RECIPIENT_TYPES = [
  {
    name: 'customMails',
    type: 'customMail',
    label: 'Custom Emails',
    description: 'Send to specific email addresses',
  },
  {
    name: 'attributionMails',
    type: 'attributionMail',
    label: 'Dynamic Emails',
    description: 'Send to emails from automation context',
  },
  {
    name: 'teamMembers',
    type: 'teamMember',
    label: 'Team Members',
    description: 'Send to specific team members',
  },
  {
    name: 'customers',
    type: 'customer',
    label: 'Customers',
    description: 'Send to specific customers',
  },
];

export const DEFAULT_EMAIL_TEMPLATES = {
  WELCOME: {
    name: 'Welcome Email',
    subject: 'Welcome to {{company.name}}!',
    content: `
      <h1>Welcome {{customer.firstName}}!</h1>
      <p>Thank you for joining {{company.name}}. We're excited to have you on board.</p>
      <p>Best regards,<br>{{company.name}} Team</p>
    `,
  },
  NOTIFICATION: {
    name: 'General Notification',
    subject: 'Notification from {{company.name}}',
    content: `
      <h2>{{subject}}</h2>
      <div>{{content}}</div>
      <p>Best regards,<br>{{company.name}} Team</p>
    `,
  },
  REMINDER: {
    name: 'Reminder Email',
    subject: 'Reminder: {{subject}}',
    content: `
      <h2>Reminder</h2>
      <p>{{content}}</p>
      <p>Don't forget to take action if needed.</p>
      <p>Best regards,<br>{{company.name}} Team</p>
    `,
  },
};

export const QUEUE_NAMES = {
  EMAIL: 'email-notifications',
  SMS: 'sms-notifications',
  PUSH: 'push-notifications',
  IN_APP: 'in-app-notifications',
  SCHEDULED: 'scheduled-notifications',
} as const;

export const JOB_NAMES = {
  SEND_EMAIL: 'send-email',
  SEND_SMS: 'send-sms',
  SEND_PUSH: 'send-push',
  SEND_IN_APP: 'send-in-app',
  PROCESS_SCHEDULED: 'process-scheduled',
  SEND_BULK_EMAIL: 'send-bulk-email',
} as const;
