import { initTRPC } from '@trpc/server';
import { ITRPCContext } from '~/init-trpc';
import { z } from 'zod';

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
    updateMany: t.procedure
      .input(
        z.object({
          selector: z.record(z.any()),
          modifier: z.record(z.any()),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        const { selector, modifier } = input;
        return await models.Customers.updateMany(selector, modifier);
      }),
  }),
});
