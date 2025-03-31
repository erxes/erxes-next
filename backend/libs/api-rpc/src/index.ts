import { initTRPC } from '@trpc/server';
import { ICustomer } from 'erxes-core-types';

const t = initTRPC.create();

export const serviceRouter = t.router({
  customer: t.router({
    list: t.procedure.query(async () => {
      return [] as ICustomer[];
    }),
  }),
});

export const appRouter = serviceRouter;

export type AppRouter = typeof appRouter;
