import {
  createTRPCUntypedClient,
  httpBatchLink,
  TRPCRequestOptions,
} from '@trpc/client';
import { getPlugin } from '../service-discovery';

export type MessageProps = {
  method: 'query' | 'mutation';
  pluginName: string;
  module: string;
  action: string;
  input: any;
  defaultValue?: any;
  options?: TRPCRequestOptions;
};
export interface InterMessage {
  subdomain: string;
  data?: any;
  timeout?: number;
  defaultValue?: any;
  thirdService?: boolean;
}

export interface RPSuccess {
  status: 'success';
  data?: any;
}
export interface RPError {
  status: 'error';
  errorMessage: string;
}
export type RPResult = RPSuccess | RPError;
export type RP = (params: InterMessage) => RPResult | Promise<RPResult>;
export const sendTRPCMessage = async ({
  pluginName,
  method,
  module,
  action,
  input,
  defaultValue,
  options,
}: MessageProps) => {
  const pluginInfo = await getPlugin(pluginName);

  const client = createTRPCUntypedClient({
    links: [httpBatchLink({ url: `${pluginInfo.address}/trpc` })],
  });

  const result = await client[method](`${module}.${action}`, input, options);

  return result || defaultValue;
};
