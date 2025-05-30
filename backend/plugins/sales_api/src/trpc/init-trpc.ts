import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';

export type SalesTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<SalesTRPCContext>().create();

export const appRouter = t.router({
  sample: {
    hello: t.procedure.query(() => {
      return 'Hello Sample';
    }),
  },
});

export type AppRouter = typeof appRouter;
