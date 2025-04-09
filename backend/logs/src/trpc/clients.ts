import { httpBatchStreamLink, createTRPCUntypedClient } from '@trpc/client';
import { CoreTRPCAppRouter } from 'erxes-api-rpc';
import { getService } from 'erxes-api-utils';

export const coreClient = async () => {
  const coreService = await getService('core');

  return createTRPCUntypedClient({
    links: [
      httpBatchStreamLink({
        url: `${coreService.address}/trpc`,
      }),
    ],
  });
};
