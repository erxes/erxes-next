import { Route } from 'react-router';

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
          moduleName={module.name}
          pluginName={`${module.pluginName}_ui`}
          remoteModuleName={module.name}
        />
      }
    />
  ));
};

export const getPluginsSettingsRoutes = () => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);
  const plugins = Object.values(pluginsMetaData || {});

  const settingsModules = plugins.flatMap((plugin) =>
    plugin.modules
      .filter((module) => module.hasSettings)
      .map((module) => ({
        ...module,
        pluginName: plugin.name,
      })),
  );

  return settingsModules.map((module) => (
    <Route
      key={module.name}
      path={`/${module.path}/*`}
      element={
        <RenderPLuginsComponent
          moduleName={module.name}
          pluginName={`${module.pluginName}_ui`}
          remoteModuleName={`${module.name}Settings`}
        />
      }
    />
  ));
};
