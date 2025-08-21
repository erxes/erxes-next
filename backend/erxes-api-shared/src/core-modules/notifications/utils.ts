import { sendWorkerQueue } from '../../utils';
import { z } from 'zod';
const baseNotificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  metadata: z.record(z.any()).optional(),
});

const systemNotificationSchema = baseNotificationSchema.extend({
  kind: z.literal('system'),
});

// User notification
const userNotificationSchema = baseNotificationSchema.extend({
  kind: z.literal('user').default('user'),
  fromUserId: z.string(),
  contentType: z.string(),
  contentTypeId: z.string(),
  action: z.string(),
  notificationType: z.string(),
  userIds: z.array(z.string()),
});

// Union for notification
export const notificationZTypeSchema = z.discriminatedUnion('kind', [
  systemNotificationSchema,
  userNotificationSchema,
]);

export type INotificationData = z.infer<typeof notificationZTypeSchema>;

export const sendNotification = async (
  subdomain: string,
  data: { userIds: string[] } & Partial<INotificationData>,
) => {
  sendWorkerQueue('notifications', 'notifications').add('notifications', {
    subdomain,
    data,
  });
};
