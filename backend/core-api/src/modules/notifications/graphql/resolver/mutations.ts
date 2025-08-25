import { graphqlPubsub } from 'erxes-api-shared/utils';
import { AnyBulkWriteOperation, model } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { generateNotificationsFilter } from '~/modules/notifications/graphql/resolver/utils';
// import { BulkWriteOperation } from 'mongodb';

export const notificationMutations = {
  async archiveNotification(_root, { _id }, { models, user }: IContext) {
    await models.Notifications.updateOne({ _id }, { isArchived: true });

    graphqlPubsub.publish(`notificationArchived:${user._id}`, {
      notificationArchived: { userId: user._id, notificationId: _id },
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

    const notificationIds = await models.Notifications.find(selector, {
      _id: 1,
    }).distinct('_id');

    await models.Notifications.updateMany(selector, { isArchived: true });

    graphqlPubsub.publish(`notificationArchived:${user._id}`, {
      notificationArchived: { userId: user._id, notificationIds },
    });

    return 'removed successfully';
  },

  async markNotificationAsRead(_root, { _id }, { models, user }: IContext) {
    const notification = await models.Notifications.findOne({ _id });
    if (!notification) throw new Error('Not found notification');

    if (!notification.isRead) {
      await models.Notifications.updateOne(
        { _id },
        { $set: { isRead: true, readAt: new Date() } },
      );

      graphqlPubsub.publish(`notificationRead:${user._id}`, {
        notificationRead: { userId: user._id, notificationId: _id },
      });
    }

    return { success: true };
  },

  async markAsReadNotifications(
    _root,
    { ids, ...filters },
    { models, user }: IContext,
  ) {
    const filter = ids.length
      ? { _id: { $in: ids } }
      : generateNotificationsFilter(filters as any);

    const notificationIds = await models.Notifications.find(filter, {
      _id: 1,
    }).distinct('_id');

    await models.Notifications.updateMany(
      { ...filter, userId: user._id },
      {
        $set: { isRead: true, readAt: new Date() },
      },
    );

    graphqlPubsub.publish(`notificationRead:${user._id}`, {
      notificationRead: { userId: user._id, notificationIds },
    });

    return { success: true };
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
