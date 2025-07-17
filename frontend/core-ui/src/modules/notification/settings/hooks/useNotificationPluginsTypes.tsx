import { NOTIFICATION_PLUGINS_TYPES } from '@/notification/settings/graphql/notificationSettingsQueries';
import { PluginsNotificationConfig } from '@/notification/settings/types/notificationSettings';
import { useQuery } from '@apollo/client';

export const useNotificationPluginsTypes = () => {
  const { data, loading } = useQuery<{
    pluginsNotifications: PluginsNotificationConfig[];
  }>(NOTIFICATION_PLUGINS_TYPES);

  const { pluginsNotifications = [] } = data || {};

  return {
    pluginsNotifications,
    loading,
  };
};
