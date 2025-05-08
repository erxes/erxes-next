import { initTRPC } from '@trpc/server';

import * as trpcExpress from '@trpc/server/adapters/express';
import { getSubdomain } from 'erxes-api-shared/utils';

import { contactRouter } from '~/modules/contacts/trpc';
import { relationTrpcRouter } from '~/modules/relations/trpc/relation';
import { conformityTrpcRouter } from '~/modules/conformities/trpc/conformity';
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

export const appRouter = t.mergeRouters(
  contactRouter,
  conformityTrpcRouter,
  relationTrpcRouter,
);

export type AppRouter = typeof appRouter;
