import { getPlugin, getPlugins } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

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

  async notifications(_root, _args, { models, user }: IContext) {
    return await models.Notifications.find({ userId: user._id });
  },

  async notification(_root, { _id }, { models }: IContext) {
    const notification = await models.Notifications.findOne({ _id });
    if (!notification) {
      throw new Error('Not found notification');
    }

    if (!notification?.isRead) {
      await models.Notifications.updateOne(
        { _id },
        { $set: { isRead: true, readAt: new Date() } },
      );
    }

    return notification;
  },

  async userNotificationSettings(_root, _args, { models, user }: IContext) {
    console.log({ userId: user._id });
    return await models.UserNotificationSettings.findOne({ userId: user._id });
  },
};
