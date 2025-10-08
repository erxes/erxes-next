import { Route } from 'react-router';

import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';
import { pluginsConfigState } from 'ui-modules';
import { useAtom } from 'jotai';

export const getPluginsRoutes = () => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);
  const plugins = Object.values(pluginsMetaData || {});

  return plugins.map((module) => (
    <Route
      key={module.name}
      path={`/${module.path}/*`}
      element={
        <RenderPluginsComponent
          moduleName={module.name}
          pluginName={`${module.name}_ui`}
          remoteModuleName={module.name}
        />
      }
    />
  ));
};

export const getPluginsSettingsRoutes = () => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);
  const plugins = Object.values(pluginsMetaData || {});

  console.log(plugins);

  return plugins.map((plugin) => (
    <Route
      key={plugin.name}
      path={`/${plugin.path}/*`}
      element={
        <RenderPluginsComponent
          moduleName={plugin.name}
          pluginName={`${plugin.name}_ui`}
          remoteModuleName={`${plugin.name}Settings`}
        />
      }
    />
  ));
};
