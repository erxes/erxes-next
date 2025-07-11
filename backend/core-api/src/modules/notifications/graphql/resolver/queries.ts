import { INotificationDocument } from 'erxes-api-shared/core-modules';
import {
  cursorPaginate,
  getPlugin,
  getPlugins,
  graphqlPubsub,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

const generateNotificationsFilter = (params: {
  status: 'UNREAD' | 'READ' | 'ALL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  type: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  fromDate: string;
  endDate: string;
  module: string;
}) => {
  const filter: any = {};

  if (params?.status === 'READ') {
    filter.isRead = true;
  }

  if (params?.status === 'UNREAD') {
    filter.isRead = false;
  }

  if (params?.priority) {
    filter.priority = params.priority;
  }

  if (params?.type) {
    filter.type = params.type;
  }

  if (params?.fromDate) {
    filter.createdAt = { $gte: params.fromDate };
  }

  if (params?.endDate) {
    filter.createdAt = { ...(filter.createdAt || {}), $lte: params.endDate };
  }

  if (params?.module) {
    filter.contentType = { $regex: `^[^:]+:${params.module}\\.` };
  }

  return filter;
};

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

    const { list, totalCount, pageInfo } =
      await cursorPaginate<INotificationDocument>({
        model: models.Notifications,
        params: {
          ...params,
          orderBy: { createdAt: -1 },
        },
        query: { ...filter, userId: user._id },
      });

    return {
      list,
      totalCount,
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
