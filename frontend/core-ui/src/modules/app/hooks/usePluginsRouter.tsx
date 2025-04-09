import { Route } from 'react-router';
import { getInstance } from '@module-federation/enhanced/runtime';

import { PluginMainPage } from '~/plugins/components/PluginMainPage';
import { PluginSettingsPage } from '~/plugins/components/PluginSettingsPage';

export const getPluginsRoutes = () => {
  const instance = getInstance();
  const remotes = instance?.options.remotes ?? [];
  return remotes.map((remote) => (
    <Route
      key={remote.name}
      path={`/${remote.name.replace('_ui', '')}/*`}
      element={<PluginMainPage pluginName={remote.name} />}
    />
  ));
};

export const getPluginsSettingsRoutes = () => {
  const instance = getInstance();
  const remotes = instance?.options.remotes ?? [];

  return remotes.map((plugin) => (
    <Route
      key={plugin.name}
      path={`/${plugin.name.replace('_ui', '')}/*`}
      element={<PluginSettingsPage pluginName={plugin.name} />}
    />
  ));
};
