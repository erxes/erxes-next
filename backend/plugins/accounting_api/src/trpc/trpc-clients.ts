import { httpBatchLink, createTRPCUntypedClient } from '@trpc/client';
import { getPlugin, isEnabled } from 'erxes-api-shared/utils';

export const coreTRPCClient = async (): Promise<
  ReturnType<typeof createTRPCUntypedClient>
> => {
  const isCoreEnabled = await isEnabled('core');

  if (!isCoreEnabled) {
    throw new Error('Core plugin is not enabled');
  }

  const core = await getPlugin('core');

  const client = createTRPCUntypedClient({
    links: [httpBatchLink({ url: core.address + '/trpc' })],
  });

  return client;
};

export const sendCoreMessage = async (
  args //: MessageArgsOmitService,
): Promise<any> => {
  return {};
  // sendMessage({
  //   serviceName: 'core',
  //   ...args,
  // });
};

export const getConfig = async (subdomain: string, code: string, defaultValue?: any) => {
  return {};
  // sendCoreMessage({
  //   subdomain,
  //   action: 'getConfig',
  //   data: { code, defaultValue },
  //   isRPC: true
  // });
}
