import { getInstance } from '@module-federation/enhanced/runtime';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { pluginsConfigState } from 'erxes-shared-states';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const PluginsProvidersEffect = () => {
  const instance = getInstance(); // Get the instance of the module federation runtime
  const remotes = instance?.options.remotes; // List of remotes
  const setPluginsMetaData = useSetRecoilState(pluginsConfigState);

  useEffect(() => {
    if (remotes && remotes.length > 0) {
      const loadConfig = async () => {
        for (const remote of remotes) {
          try {
            const remoteConfig = (await loadRemote(
              `${remote.name}/Config`
            )) as any;

            const pluginConfig = remoteConfig.CONFIG;

            setPluginsMetaData((prev) => ({
              ...prev,
              [remote.name]: pluginConfig,
            }));
          } catch (error) {
            console.error(
              `Failed to load metadata from ${remote.name}:`,
              error
            );
          }
        }
      };

      loadConfig();
    }
  }, [remotes, setPluginsMetaData]);

  return null;
};
