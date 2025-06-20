import { useAtom } from 'jotai';
import { pluginsConfigState } from 'ui-modules';

export const useRelationWidgetsModules = () => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  if (!pluginsMetaData) {
    return [];
  }

  const plugins = Object.values(pluginsMetaData);

  return plugins.flatMap((plugin) =>
    plugin.modules
      .filter((module) => module.hasRelationWidget)
      .map((module) => ({
        ...module,
        pluginName: plugin.name,
      })),
  );
};
