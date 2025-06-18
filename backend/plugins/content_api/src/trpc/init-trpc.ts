import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';

import { IModels } from '~/connectionResolvers';

import {
  portalRouter,
  portalUserRouter,
  portalNotificationRouter,
  portalUserCardRouter,
} from '~/modules/portal/trpc/portal';
import { cmsRouter } from '~/modules/portal/trpc/cms';
import { knowledgebaseRouter } from '~/modules/knowledgebase/trpc/knowledgebase';

export type ContentTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<ContentTRPCContext>().create();

export const appRouter = t.mergeRouters(
  portalRouter,
  portalUserRouter,
  portalNotificationRouter,
  portalUserCardRouter,
  cmsRouter,
  knowledgebaseRouter,
);

export type AppRouter = typeof appRouter;
