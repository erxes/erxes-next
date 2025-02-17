import { getInstance } from '@module-federation/enhanced/runtime';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { pluginsConfigState, PluginsConfig } from 'erxes-ui-shared-states';
import { loadRemote } from '@module-federation/enhanced/runtime';

type RemoteConfig = {
  CONFIG: PluginsConfig;
};

export const PluginConfigsProvidersEffect = () => {
  const instance = getInstance();
  const remotes = instance?.options.remotes;
  const setPluginsConfig = useSetRecoilState(pluginsConfigState);

  console.log(remotes);
  useEffect(() => {
    if (remotes && remotes.length > 0) {
      const loadConfig = async () => {
        for (const remote of remotes) {
          try {
            const remoteConfig = (await loadRemote(
              `${remote.name}/Config`,
            )) as RemoteConfig;

            const pluginConfig = remoteConfig.CONFIG;

            setPluginsConfig((prev) => ({
              ...prev,
              [remote.name]: pluginConfig,
            }));
          } catch (error) {
            console.error(`Failed to load config from ${remote.name}:`, error);
          }
        }
      };

      loadConfig();
    }
  }, [remotes, setPluginsConfig]);

  return null;
};
