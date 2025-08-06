import { useNotificationsSettingsContext } from '@/notification/settings/context/NotificationSettingsContext';
import { PluginsNotificationConfig } from '@/notification/settings/types/notificationSettings';
import { useState } from 'react';

export const useNotificationContent = () => {
  const [search, setSearch] = useState('');
  const { loading, pluginsNotifications } = useNotificationsSettingsContext();

  const filteredPlugins = pluginsNotifications
    .map(({ pluginName, modules }) => {
      const filteredModules = modules
        .map(({ name: moduleName, types, ...rest }) => {
          const filteredTypes = types.filter(({ text }) =>
            `${pluginName} ${moduleName} ${text}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          );

          return filteredTypes.length
            ? { name: moduleName, types: filteredTypes, ...rest }
            : null;
        })
        .filter(Boolean) as Exclude<(typeof modules)[number], null>[];

      return filteredModules.length
        ? { pluginName, modules: filteredModules }
        : null;
    })
    .filter(Boolean) as PluginsNotificationConfig[];

  return {
    loading,
    filteredPlugins,
    search,
    setSearch,
  };
};
