import { INotificationDocument } from 'erxes-api-shared/core-modules';
import {
  cursorPaginate,
  getPlugin,
  getPlugins,
  graphqlPubsub,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { generateNotificationsFilter } from '~/modules/notifications/graphql/resolver/utils';

export const notificationQueries = {
  async pluginsNotifications() {
    const plugins = await getPlugins();

    const pluginsNotifications: Array<{
      pluginName: string;
      modules: Array<{
        name: string;
        description: string;
        icon: string;
        types: Array<{ name: string; text: string }>;
      }>;
    }> = [];
    for (const pluginName of plugins) {
      const plugin = await getPlugin(pluginName);
      const meta = plugin.config?.meta || {};

      if (meta && meta.notificationModules) {
        const notificationModules = meta.notificationModules || [];
        pluginsNotifications.push({
          pluginName,
          modules: notificationModules,
        });
      }
    }

    return pluginsNotifications;
  },

  async notifications(_root, params, { models, user }: IContext) {
    const filter = generateNotificationsFilter(params);

    let prioritized: INotificationDocument[] = [];

    if (params?.ids?.length) {
      const idsCount = params.ids.length;
      params.limit -= idsCount;
      prioritized = await models.Notifications.find({
        _id: { $in: params.ids },
        userId: user._id,
      });
    }

    const { list, totalCount, pageInfo } =
      await cursorPaginate<INotificationDocument>({
        model: models.Notifications,
        params: {
          ...params,
          orderBy: params?.orderBy || { createdAt: -1 },
        },
        query: { ...filter, userId: user._id, isArchived: { $ne: true } },
      });

    return {
      list: [...prioritized, ...list],
      totalCount: totalCount + (params?.ids?.length || 0),
      pageInfo,
    };

    // return await models.Notifications.find({ userId: user._id });
  },

  async notificationDetail(_root, { _id }, { models, user }: IContext) {
    const notification = await models.Notifications.findOne({ _id });
    if (!notification) {
      throw new Error('Not found notification');
    }

    if (!notification?.isRead) {
      await models.Notifications.updateOne(
        { _id },
        { $set: { isRead: true, readAt: new Date() } },
      );
      graphqlPubsub.publish(`notificationRead:${user._id}`, {
        notificationRead: { userId: user._id },
      });
    }

    return notification;
  },

  async unreadNotificationsCount(_root, _args, { models, user }: IContext) {
    return await models.Notifications.countDocuments({
      userId: user._id,
      isRead: false,
    });
  },
  async userNotificationSettings(_root, _args, { models, user }: IContext) {
    return await models.UserNotificationSettings.findOne({ userId: user._id });
  },
};
