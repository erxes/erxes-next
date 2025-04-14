import { httpBatchStreamLink, createTRPCUntypedClient } from '@trpc/client';
import { getService } from 'erxes-api-shared/utils';

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
