import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const appRouter = t.router({
  sample: {
    hello: t.procedure.query(() => {
      return 'Hello Sample';
    }),
  },
});

export type AppRouter = typeof appRouter;
