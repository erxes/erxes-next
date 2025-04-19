import { initTRPC } from '@trpc/server';
import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const customerRouter = t.router({
  customer: t.router({
    list: t.procedure.query(async ({ ctx }) => {
      const { models } = ctx;

      return models.Customers.find({});
    }),

    get: t.procedure.query(async () => {
      return null;
    }),

    create: t.procedure.mutation(async () => {
      return null;
    }),

    update: t.procedure.mutation(async () => {
      return null;
    }),

    delete: t.procedure.mutation(async () => {
      return null;
    }),
  }),
});
