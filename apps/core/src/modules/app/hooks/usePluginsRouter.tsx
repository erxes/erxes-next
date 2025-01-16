import { Route } from 'react-router';

import PluginMainPage from '~/plugins/components/PluginMainPage';
import PluginSettingsPage from '~/plugins/components/PluginSettingsPage';

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
