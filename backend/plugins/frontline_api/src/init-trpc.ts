import { initTRPC } from '@trpc/server';

import * as trpcExpress from '@trpc/server/adapters/express';
import { getSubdomain, ITRPCContext } from 'erxes-api-shared/utils';

import { generateModels } from './connectionResolvers';
import { inboxTrpcRouter } from './modules/inbox/trpc/inbox';
import { integrationTrpcRouter } from './modules/integrations/trpc/integration';

const t = initTRPC.context<ITRPCContext>().create();

export const appRouter = t.mergeRouters(integrationTrpcRouter, inboxTrpcRouter);

export type AppRouter = typeof appRouter;
