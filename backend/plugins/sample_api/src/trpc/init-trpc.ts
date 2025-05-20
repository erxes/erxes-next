import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

import { getSubdomain, ITRPCContext } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';

const t = initTRPC.context<ITRPCContext>().create();

export const appRouter = t.router({
  sample: {
    hello: t.procedure.query(() => {
      return 'Hello Sample';
    }),
  },
});

export type AppRouter = typeof appRouter;
