import { Route } from 'react-router';
import { getInstance } from '@module-federation/enhanced/runtime';

import { RenderPLuginsComponent } from '~/plugins/components/RenderPLuginsComponent';
import { pluginsConfigState } from 'ui-modules';
import { useAtom } from 'jotai';

export const getPluginsRoutes = () => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);
  const plugins = Object.values(pluginsMetaData || {});

  const allModules = plugins.flatMap((plugin) =>
    plugin.modules.map((module) => ({
      ...module,
      pluginName: plugin.name,
    })),
  );

  return allModules.map((module) => (
    <Route
      key={module.name}
      path={`/${module.path}/*`}
      element={
        <RenderPLuginsComponent
          pluginName={`${module.pluginName}_ui`}
          moduleName="Inbox"
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
          moduleName="Settings"
        />
      }
    />
  ));
};
