import {
  createTRPCUntypedClient,
  httpBatchLink,
  TRPCRequestOptions,
} from '@trpc/client';
import { getPlugin } from '../service-discovery';

type MessageProps = {
  method: 'query' | 'mutation';
  pluginName: string;
  module: string;
  action: string;
  data: any;
  defaultValue?: any;
  options?: TRPCRequestOptions;
};

export const sendTRPCMessage = async ({
  pluginName,
  method,
  module,
  action,
  data,
  defaultValue,
  options,
}: MessageProps) => {
  const pluginInfo = await getPlugin(pluginName);

  const client = createTRPCUntypedClient({
    links: [httpBatchLink({ url: `${pluginInfo.address}/trpc` })],
  });

  const result = await client[method](`${module}.${action}`, data, options);

  return result || defaultValue;
};
