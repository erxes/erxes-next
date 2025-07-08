import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';

import { IModels } from './connectionResolvers';
import { inboxTrpcRouter } from './modules/inbox/trpc/inbox';
import { integrationTrpcRouter } from './modules/integrations/trpc/integration';

export type FrontlineTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<FrontlineTRPCContext>().create();

export const appRouter = t.mergeRouters(integrationTrpcRouter, inboxTrpcRouter);

export type AppRouter = typeof appRouter;
