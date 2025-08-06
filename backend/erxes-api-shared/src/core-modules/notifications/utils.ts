import { sendWorkerQueue } from '../../utils';

export type INotificationData = {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  fromUserId?: string;
  userIds: string[];
  contentType: string;
  contentTypeId?: string;
  action: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  notificationType: string;
};

export const sendNotification = (
  subdomain: string,
  data: INotificationData,
) => {
  sendWorkerQueue('notifications', 'notifications').add('notifications', {
    subdomain,
    data: data,
  });
};
