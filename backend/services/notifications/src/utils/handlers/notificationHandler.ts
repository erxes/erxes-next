import { Job } from 'bullmq';
import { sendTRPCMessage, graphqlPubsub } from 'erxes-api-shared/utils';
import { debugError, debugInfo } from '@/utils/debugger';
import { INotificationJobData } from '@/types';
import { EmailService } from '@/utils/email/emailService';
import { generateModels } from '@/connectionResolver';
import { PRIORITY_ORDER } from '@/constants';

export const handleCreateNotification = async (
  job: Job<INotificationJobData>,
) => {
  const { subdomain, data } = job.data;

  try {
    const models = await generateModels(subdomain);
    const emailService = new EmailService();

    // // Get default configuration for this notification type
    // const defaultConfig = await models.NotificationConfigs.findOne({
    //   contentType: data.contentType,
    //   action: data.action || 'default',
    // });

    // if (!defaultConfig || !defaultConfig.enabled) {
    //   debugInfo(`Notification disabled for ${data.contentType}:${data.action}`);
    //   return {
    //     success: false,
    //     reason: 'Notification disabled in default data',
    //   };
    // }

    const results: any[] = [];

    // Create notifications for each user
    for (const userId of ['OQgac3z4G3I2LW9QPpAtL']) {
      try {
        // Check user notification settings
        const userSettings = await models.UserNotificationSettings.findOne({
          userId,
        });
        console.log({ userSettings: userSettings?.toObject() });

        let notificationId;

        // Create in-app notification if enabled
        const a = shouldCreateInAppNotification(null, userSettings, data);
        console.log({ a });
        if (a) {
          console.log('dakdvbkahsdv');
          const notification = await models.Notifications.create({
            title: data.title,
            message: data.message,
            type: data.type,
            userId,
            fromUserId: data.fromUserId,
            contentType: data.contentType,
            contentTypeId: data.contentTypeId,
            priority: data.priority || 'medium',
            metadata: data.metadata,
            priorityLevel: PRIORITY_ORDER[data.priority || 'medium'],
            // expiresAt: defaultConfig.expiresAfterDays
            //   ? new Date(
            //       Date.now() +
            //         defaultConfig.expiresAfterDays * 24 * 60 * 60 * 1000,
            //     )
            //   : undefined,
          });

          notificationId = notification._id;

          // Send GraphQL subscription for real-time updates
          graphqlPubsub.publish(
            `notificationInserted:${subdomain}:${'OQgac3z4G3I2LW9QPpAtL'}`,
            {
              notificationInserted: {
                ...notification.toObject(),
              },
            },
          );

          results.push({ userId, inApp: true, notificationId });
          debugInfo(`In-app notification created for user ${userId}`);
        }

        // Send email notification if enabled
        if (shouldSendEmailNotification(null, userSettings, data)) {
          try {
            // Get user email
            const user = await sendTRPCMessage({
              pluginName: 'core',
              method: 'query',
              module: 'users',
              action: 'findOne',
              input: { _id: userId },
            });

            if (user?.email) {
              // const emailResult = await emailService.sendNotificationEmail(
              //   subdomain,
              //   {
              //     toEmail: user.email,
              //     userId,
              //     notificationId,
              //     title: data.title,
              //     message: data.message,
              //     contentType: data.contentType,
              //     emailSubject: data.emailSubject || defaultConfig.emailSubject,
              //     emailTemplateId: defaultConfig.emailTemplateId,
              //     metadata: data.metadata,
              //   },
              // );
              // // Store email delivery record
              // await models.EmailDeliveries.create({
              //   notificationId,
              //   userId,
              //   email: user.email,
              //   subject: emailResult.subject,
              //   content: emailResult.content,
              //   provider: emailResult.provider,
              //   messageId: emailResult.messageId,
              //   status: emailResult.success ? 'sent' : 'failed',
              //   sentAt: emailResult.success ? new Date() : undefined,
              //   error: emailResult.error,
              //   retryCount: 0,
              // });
              // results.push({
              //   userId,
              //   email: true,
              //   emailSuccess: emailResult.success,
              //   messageId: emailResult.messageId,
              // });
              // debugInfo(
              //   `Email notification sent to user ${userId}: ${emailResult.success}`,
              // );
            } else {
              debugError(`No email found for user ${userId}`);
              results.push({ userId, email: false, error: 'No email address' });
            }
          } catch (emailError) {
            debugError(`Email sending failed for user ${userId}`, emailError);
            results.push({ userId, email: false, error: emailError.message });
          }
        }
      } catch (error) {
        debugError(`Error processing notification for user ${userId}`, error);
        results.push({ userId, error: error.message });
      }
    }

    return { success: true, results };
  } catch (error) {
    debugError('Error in notification handler', error);
    throw error;
  }
};

// Helper functions to check notification settings
function shouldCreateNotification(
  defaultConfig: any,
  userSettings: any,
  data: any,
): boolean {
  if (!userSettings) return defaultConfig.enabled;

  // Check master switch
  if (!userSettings.allNotificationsEnabled) return false;

  // Check plugin-level setting
  const [pluginName] = data.contentType.split(':');
  const pluginSetting = userSettings.pluginSettings[pluginName];
  if (pluginSetting && !pluginSetting.enabled) return false;

  // Check specific type setting
  const typeKey = `${data.contentType}.${data.action || 'default'}`;
  const typeSetting = userSettings.typeSettings[typeKey];
  if (typeSetting && !typeSetting.enabled) return false;

  return defaultConfig.enabled;
}

function shouldCreateInAppNotification(
  defaultConfig: any,
  userSettings: any,
  data: any,
): boolean {
  // if (defaultConfig&&!defaultConfig.inAppEnabled) return false;
  if (!userSettings) return true;

  // Check global in-app setting
  if (userSettings?.inAppNotificationsDisabled) return false;

  // Check plugin-level setting
  const [pluginName] = data.contentType.split(':');
  const pluginSetting = (userSettings.plugins || {})[pluginName];
  if (pluginSetting && pluginSetting?.inAppDisabled) return false;

  // Check specific type setting
  const typeKey = `${data.contentType}.${data.action || 'default'}`;
  const typeSetting = (userSettings?.types || {})[typeKey];
  if (typeSetting && typeSetting?.inAppDisabled) return false;

  return true;
}

function shouldSendEmailNotification(
  defaultConfig: any,
  userSettings: any,
  data: any,
): boolean {
  // if (!defaultConfig.emailEnabled) return false;
  if (!userSettings) return true;

  // Check global email setting
  if (userSettings?.emailNotificationsDisabled) return false;

  // Check plugin-level setting
  const [pluginName] = data.contentType.split(':');
  const pluginSetting = (userSettings?.plugins || {})[pluginName];
  if (pluginSetting?.emailDisabled) return false;

  // Check specific type setting
  const typeKey = `${data.contentType}.${data.action || 'default'}`;
  const typeSetting = (userSettings?.types || {})[typeKey];
  if (typeSetting?.emailDisabled) return false;

  return true;
}
