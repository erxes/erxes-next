import {
  createTRPCUntypedClient,
  httpBatchLink,
  TRPCClientError,
  TRPCRequestOptions,
} from '@trpc/client';
import { TRPCSubscriptionObserver } from '@trpc/client/dist/internals/TRPCUntypedClient';
import { getPlugin } from '../service-discovery';

type MessageProps = {
  method: 'query' | 'mutation';
  serviceName: string;
  module: string;
  action: string;
  data: any;
  defaultValue?: any;
  options?: TRPCRequestOptions;
};

export const sendTRPCMessage = async ({
  serviceName,
  method,
  module,
  action,
  data,
  defaultValue,
  options,
}: MessageProps) => {
  const pluginInfo = await getPlugin(serviceName);

  const client = createTRPCUntypedClient({
    links: [httpBatchLink({ url: `${pluginInfo.address}/trpc` })],
  });

  const result = await client[method](
    `${serviceName}.${module}.${action}`,
    data,
    options,
  );

  return result || defaultValue;
};
