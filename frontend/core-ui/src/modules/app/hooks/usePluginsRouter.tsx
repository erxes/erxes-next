import { Route } from 'react-router';
import { getInstance } from '@module-federation/enhanced/runtime';

import { RenderPLuginsComponent } from '~/plugins/components/RenderPLuginsComponent';

export const getPluginsRoutes = () => {
  const instance = getInstance();
  const remotes = instance?.options.remotes ?? [];
  return remotes.map((remote) => (
    <Route
      key={remote.name}
      path={`/${remote.name.replace('_ui', '')}/*`}
      element={
        <RenderPLuginsComponent
          pluginName={remote.name}
          componentType="Module"
        />
      }
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
      element={
        <RenderPLuginsComponent
          pluginName={plugin.name}
          componentType="Settings"
        />
      }
    />
  ));
};
