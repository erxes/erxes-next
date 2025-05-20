import { initTRPC } from '@trpc/server';

import * as trpcExpress from '@trpc/server/adapters/express';
import { getSubdomain, MessageProps, sendTRPCMessage } from 'erxes-api-shared/utils';

import { generateModels } from './connectionResolvers';

export const createContext = async ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  return {
    subdomain,
    models,
  };
};

export type ITRPCContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<ITRPCContext>().create();

export const appRouter = t.mergeRouters();

export type AppRouter = typeof appRouter;

export const sendCoreMessage = async (
  args: MessageProps & { pluginName?: string },
): Promise<any> => {
  return await sendTRPCMessage({
    ...args,
    pluginName: 'core',
  });
};

