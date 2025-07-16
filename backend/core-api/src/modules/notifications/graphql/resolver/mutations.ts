import { graphqlPubsub } from 'erxes-api-shared/utils';
import { AnyBulkWriteOperation } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { generateNotificationsFilter } from '~/modules/notifications/graphql/resolver/utils';
// import { BulkWriteOperation } from 'mongodb';

export const notificationMutations = {
  async archiveNotification(_root, { _id }, { models, user }: IContext) {
    await models.Notifications.updateOne({ _id }, { isArchived: true });

    graphqlPubsub.publish(`notificationRead:${user._id}`, {
      notificationRead: { userId: user._id },
    });

    return 'removed successfully';
  },
  async archiveNotifications(
    _root,
    { ids, archiveAll, filters },
    { models, user }: IContext,
  ) {
    const selector = archiveAll
      ? { ...generateNotificationsFilter(filters) }
      : { _id: { $in: ids } };

    await models.Notifications.updateMany(selector, { isArchived: true });

    graphqlPubsub.publish(`notificationRead:${user._id}`, {
      notificationRead: { userId: user._id },
    });

    return 'removed successfully';
  },
  async editUserNotificationSettings(
    _root,
    { userSettings },
    { models, user }: IContext,
  ) {
    return await models.UserNotificationSettings.updateOne(
      { userId: user._id },
      { $set: { ...userSettings } },
      { upsert: true },
    );
  },

  async editOrganizationNotificationConfigs(
    _root,
    { configs },
    { models, user }: IContext,
  ) {
    const operations: AnyBulkWriteOperation<any>[] = [];

    // Process the nested config structure
    for (const [pluginName, pluginConfigs] of Object.entries(configs as any)) {
      for (const [moduleName, moduleConfigs] of Object.entries(
        pluginConfigs as any,
      )) {
        for (const [action, config] of Object.entries(moduleConfigs as any)) {
          const contentType = `${pluginName}:${moduleName}`;

          operations.push({
            updateOne: {
              filter: { contentType, action },
              update: {
                $set: {
                  ...(config as any),
                  contentType,
                  action,
                  updatedAt: new Date(),
                  createdBy: user._id,
                },
              },
              upsert: true,
            },
          });
        }
      }
    }

    if (operations.length > 0) {
      await models.NotificationConfigs.bulkWrite(operations);
    }

    return { success: true };
  },
};
