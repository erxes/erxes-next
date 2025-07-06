import { sendWorkerQueue } from '../../utils';

type NotificationData = {
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
};

export const sendNotification = (subdomain: string, data: NotificationData) => {
  console.log({ data });
  sendWorkerQueue('notifications', 'notifications').add('notifications', {
    subdomain,
    data: data,
  });
};
