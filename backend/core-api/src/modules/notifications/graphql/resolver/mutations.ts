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
    if (!user?.isOwner) {
      throw new Error('Permission required');
    }

    const orgConfig = await models.NotificationConfigs.findOne({});
    if (!orgConfig) {
      await models.NotificationConfigs.create({
        ...configs,
        createdBy: user._id,
      });
    } else {
      await models.NotificationConfigs.updateOne(
        { _id: orgConfig._id },
        { $set: { ...configs } },
      );
    }
    return { success: true };
  },
};
