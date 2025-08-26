import { generateModels, IModels } from '@/connectionResolver';
import { PRIORITY_ORDER } from '@/constants';
import { INotificationJobData } from '@/types';
import { debugError, debugInfo } from '@/utils/debugger';
import { EmailService } from '@/utils/email/emailService';
import { getUserById } from '@/utils/email/emailUtils';
import { Job } from 'bullmq';

import {
  INotificationConfigDocument,
  INotificationData,
  INotificationDocument,
  IUserNotificationSettingsDocument,
} from 'erxes-api-shared/core-modules';
import { graphqlPubsub } from 'erxes-api-shared/utils';

export const handleCreateNotification = async (
  job: Job<INotificationJobData>,
) => {
  const { subdomain, data } = job.data;
  const models = await generateModels(subdomain);
  const emailService = new EmailService();
  const results: any[] = [];

  // Get default configuration for this notification type
  const defaultConfig = await models.NotificationConfigs.findOne({});

  for (const userId of data?.userIds || []) {
    try {
      let notification: INotificationDocument | undefined;

      if (data.kind === 'system') {
        notification = await createInAppNotification(
          subdomain,
          models,
          {
            kind: 'system',
            title: data.title,
            message: data.message,
            type: data.type,
            priority: data.priority,
            metadata: data.metadata,
          },
          userId,
        );
        results.push({ userId, inApp: true, notificationId: notification._id });
        debugInfo(`In-app notification created for user ${userId}`);
        continue;
      }

      const userSettings = await models.UserNotificationSettings.findOne({
        userId,
      }).lean();
      const notificationSettings = {
        inApp: shouldSendNotification(
          'inApp',
          defaultConfig,
          userSettings,
          data,
        ),
        email: shouldSendNotification(
          'email',
          defaultConfig,
          userSettings,
          data,
        ),
      };

      // In-app notification
      // if (notificationSettings.inApp) {
      notification = await createInAppNotification(
        subdomain,
        models,
        data,
        userId,
      );
      results.push({ userId, inApp: true, notificationId: notification._id });
      debugInfo(`In-app notification created for user ${userId}`);
      // }

      // Email notification
      if (notificationSettings.email) {
        const user = await getUserById(userId);
        if (user?.email) {
          const emailResult = await emailService.sendNotificationEmail({
            toEmail: user.email,
            user,
            notificationId: notification?._id,
            title: data.title,
            message: data.message,
            contentType: data.contentType,
            metadata: data.metadata,
          });

          await models.EmailDeliveries.create({
            notificationId: notification?._id,
            userId,
            email: user.email,
            subject: emailResult.subject,
            content: emailResult.content,
            provider: emailResult.provider,
            messageId: emailResult.messageId,
            status: emailResult.success ? 'sent' : 'failed',
            sentAt: emailResult.success ? new Date() : undefined,
            error: emailResult.error,
            retryCount: 0,
          });

          results.push({
            userId,
            email: true,
            emailSuccess: emailResult.success,
            messageId: emailResult.messageId,
          });

          debugInfo(
            `Email notification sent to user ${userId}: ${emailResult.success}`,
          );
        } else {
          debugError(`No email found for user ${userId}`);
          results.push({ userId, email: false, error: 'No email address' });
        }
      }
    } catch (error) {
      debugError(`Error processing notification for user ${userId}`, error);
      results.push({ userId, error: error.message });
    }
  }

  return { success: true, results };
};

async function createInAppNotification(
  subdomain: string,
  models: IModels,
  data: INotificationData,
  userId: string,
) {
  let notification: INotificationDocument;

  if (
    data.kind === 'user' &&
    (await models.Notifications.exists({
      contentTypeId: data.contentTypeId,
      contentType: data.contentType,
      userId, // Added userId to ensure we're updating the correct user's notification
    })) &&
    !data.allowMultiple
  ) {
    // Update existing notification
    const updatedNotification = await models.Notifications.findOneAndUpdate(
      {
        contentTypeId: data.contentTypeId,
        contentType: data.contentType,
        userId,
      },
      {
        ...data,
        isRead: false,
        priorityLevel: PRIORITY_ORDER[data?.priority || 'medium'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      { new: true }, // Return the updated document
    );

    if (!updatedNotification) {
      throw new Error('Failed to update existing notification');
    }
    notification = updatedNotification;
  } else {
    // Create new notification
    notification = await models.Notifications.create({
      ...data,
      userId,
      priorityLevel: PRIORITY_ORDER[data?.priority || 'medium'],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  // Publish the notification event
  graphqlPubsub.publish(`notificationInserted:${subdomain}:${userId}`, {
    notificationInserted: { ...notification.toObject() },
  });

  return notification;
}

function shouldSendNotification(
  type: 'email' | 'inApp',
  defaultConfig: any,
  userSettings: IUserNotificationSettingsDocument | null,
  data: Extract<INotificationData, { kind: 'user' }>,
): boolean {
  let shouldSend = true;

  if (userSettings) {
    if (!isNotificationAllowedUser(type, userSettings, data)) {
      shouldSend = false;
    }

    if (!isNotificationAllowedOrg(type, defaultConfig, data)) {
      shouldSend = false;
    }
  }

  return shouldSend;
}

function isNotificationAllowedUser(
  type: 'email' | 'inApp',
  userSettings: IUserNotificationSettingsDocument | null,
  data: Extract<INotificationData, { kind: 'user' }>,
) {
  if (!userSettings) return true;

  // Global-level setting
  if (type === 'email' && userSettings.emailNotificationsDisabled) return false;
  if (type === 'inApp' && userSettings.inAppNotificationsDisabled) return false;

  const [pluginName] = (data?.contentType || '').split(':');
  const pluginSettings = (userSettings.plugins || {})[pluginName];

  // Plugin-level setting
  if (type === 'email' && pluginSettings?.emailDisabled) return false;
  if (type === 'inApp' && pluginSettings?.inAppDisabled) return false;

  // Type-level setting
  const typeKey = data.notificationType || '';
  const typeSetting = (pluginSettings?.types || {})[typeKey];

  if (type === 'email' && typeSetting?.emailDisabled) return false;
  if (type === 'inApp' && typeSetting?.inAppDisabled) return false;

  return true;
}

function isNotificationAllowedOrg(
  type: 'email' | 'inApp',
  defaultConfig: INotificationConfigDocument | null,
  data: Extract<INotificationData, { kind: 'user' }>,
) {
  if (!defaultConfig) return true;

  const {
    emailNotificationsDisabled,
    inAppNotificationsDisabled,
    plugins = {},
  } = defaultConfig || {};

  // Global-level setting
  if (type === 'email' && emailNotificationsDisabled) return false;

  if (type === 'inApp' && inAppNotificationsDisabled) return false;

  const [pluginName] = (data?.contentType || '').split(':');
  const pluginSettings = plugins[pluginName];

  // Plugin-level setting
  if (type === 'email' && pluginSettings?.emailDisabled) return false;

  if (type === 'inApp' && pluginSettings?.inAppDisabled) return false;

  // Type-level setting
  const typeKey = data.notificationType || '';
  const typeSetting = (pluginSettings?.types || {})[typeKey];

  if (type === 'email' && typeSetting?.emailDisabled) return false;

  if (type === 'inApp' && typeSetting?.inAppDisabled) return false;

  return true;
}
