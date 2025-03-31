import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

interface ICustomer {
  firstName: string;
}

export const serviceRouter = t.router({
  customer: t.router({
    list: t.procedure.query(async () => {
      return [
        {
          firstName: 'John Doe',
        },
        {
          firstName: 'Jane Smith',
        },
      ] as ICustomer[];
    }),
  }),
});

export const appRouter = serviceRouter;

export type AppRouter = typeof appRouter;
