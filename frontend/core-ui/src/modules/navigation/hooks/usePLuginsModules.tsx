import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { pluginsConfigState } from 'ui-modules';
import { IUIConfig } from 'erxes-ui';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';

export const usePluginsModules = () => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  const modules = useMemo(() => {
    const coreModules = [
      ...CORE_MODULES.filter((module) => module.hasSettings),
    ];

    if (pluginsMetaData) {
      const pluginsModules = Object.values(pluginsMetaData || {}).flatMap(
        (plugin) =>
          plugin.modules.map((module) => ({
            ...module,
            pluginName: plugin.name,
          })),
      );

      return [...coreModules, ...pluginsModules] as IUIConfig['modules'];
    }
    return coreModules;
  }, [pluginsMetaData]);

  return modules;
};
