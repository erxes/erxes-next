import { AppPath } from '@/types/AppPath';
import { init } from '@module-federation/enhanced/runtime';

import { Route } from 'react-router-dom';

import PluginMainPage from '~/plugins/PluginMainPage';
import PluginSettingsPage from '~/plugins/PluginSettingsPage';

export const usePluginsRouter = () => {
  return window.plugins?.map((plugin) => (
    <Route
      key={plugin.name}
      path={`/${plugin.name}/*`}
      element={<PluginMainPage pluginName={plugin.name} />}
    />
  ));
};

export const usePLuginsSettingsRoutes = () => {
  return window.plugins?.map((plugin) => (
    <Route
      key={plugin.name}
      path={`/${plugin.name}/*`}
      element={<PluginSettingsPage pluginName={plugin.name} />}
    />
  ));
};
