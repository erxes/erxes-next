import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';

import { IModels } from '~/connectionResolvers';

import { portalRouter } from '~/modules/portal/trpc/portal';

export type ContentTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<ContentTRPCContext>().create();

export const appRouter = t.mergeRouters(portalRouter);

export type AppRouter = typeof appRouter;
