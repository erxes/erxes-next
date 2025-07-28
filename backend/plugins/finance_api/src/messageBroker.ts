import { sendTRPCMessage } from 'erxes-api-shared/utils';

export const getConfig = async (code: string) => {
  const configs = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'configs',
    action: 'getConfigs',
    input: {},
    defaultValue: [],
  });

  return configs[code];
};
