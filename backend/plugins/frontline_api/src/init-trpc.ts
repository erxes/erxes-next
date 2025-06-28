import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';

import { IModels } from './connectionResolvers';
import { inboxTrpcRouter } from './modules/inbox/trpc/inbox';
import { integrationTrpcRouter } from './modules/integrations/trpc/integration';
import { z } from 'zod';

export type FrontlineTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<FrontlineTRPCContext>().create();

export const appRouter = t.mergeRouters(
  integrationTrpcRouter,
  inboxTrpcRouter,
  t.router({
    fields: t.router({
      getFieldList: t.procedure
        .input(
          z.object({
            type: z.string(),
            collectionType: z.string().optional(),
            segmentId: z.string().optional(),
            usageType: z.string().optional(),
            config: z.record(z.any()).optional(),
          }),
        )
        .query(async ({ ctx, input }) => {
          const { subdomain } = ctx;
          const { type } = input;
          console.log({ input });

          return [];
        }),
    }),
  }),
);

export type AppRouter = typeof appRouter;
