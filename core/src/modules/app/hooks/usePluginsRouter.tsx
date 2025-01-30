import { Route } from 'react-router';

import { getInstance } from '@module-federation/enhanced/runtime';

import { PluginMainPage } from '~/plugins/components/PluginMainPage';
import { PluginSettingsPage } from '~/plugins/components/PluginSettingsPage';

export const usePluginsRouter = () => {
  const instence = getInstance();
  const remotes = instence?.options.remotes;

  return remotes?.map((remote) => (
    <Route
      key={remote.name}
      path={`/${remote.name}/*`}
      element={<PluginMainPage pluginName={remote.name} />}
    />
  ));
};

export const usePLuginsSettingsRoutes = () => {
  const instence = getInstance();
  const remotes = instence?.options.remotes;

  return remotes?.map((plugin) => (
    <Route
      key={plugin.name}
      path={`/${plugin.name}/*`}
      element={<PluginSettingsPage pluginName={plugin.name} />}
    />
  ));
};
