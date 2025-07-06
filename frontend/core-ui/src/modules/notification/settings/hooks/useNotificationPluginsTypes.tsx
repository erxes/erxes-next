import { NOTIFICATION_PLUGINS_TYPES } from '@/notification/settings/graphql/notificationSettingsQueries';
import { useQuery } from '@apollo/client';

export const useNotificationPluginsTypes = () => {
  const { data, loading } = useQuery<{
    pluginsNotifications: {
      pluginName: string;
      modules: {
        name: string;
        description: string;
        icon: string;
        types: {
          name: string;
          text: string;
        }[];
      }[];
    }[];
  }>(NOTIFICATION_PLUGINS_TYPES);

  const { pluginsNotifications = [] } = data || {};

  return {
    pluginsNotifications,
    loading,
  };
};
