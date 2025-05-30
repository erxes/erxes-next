import { initTRPC } from '@trpc/server';

import * as trpcExpress from '@trpc/server/adapters/express';
import { getSubdomain, MessageProps, sendTRPCMessage, } from 'erxes-api-shared/utils';

import { generateModels } from './connectionResolvers';
import { accountTrpcRouter } from './modules/accounting/trpc/account';
import { transactionTrpcRouter } from './modules/accounting/trpc/transaction';

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

export const appRouter = t.mergeRouters(accountTrpcRouter, transactionTrpcRouter);

export type AppRouter = typeof appRouter;

export const sendCoreMessage = async (
  args: MessageProps,
): Promise<any> => {
  return await sendTRPCMessage({
    ...args,
    pluginName: 'core',
  });
};

export const getConfig = async (code: string, defaultValue?: any) => {
  return await sendTRPCMessage({
    pluginName: 'core',
    module: 'configs',
    action: 'getConfig',
    input: { code, defaultValue },
  });
}
