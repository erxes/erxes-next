import { initTRPC } from '@trpc/server';
import { generateModels } from '~/connectionResolvers';
import { z } from 'zod';
import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const companyTrpcRouter = t.router({
  company: t.router({
    list: t.procedure.query(async () => {
      const subdomain = 'os';
      const models = await generateModels(subdomain);

      return models.Companies.find({});
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
        return await models.Companies.updateMany(selector, modifier);
      }),

    delete: t.procedure.mutation(async () => {
      return null;
    }),
  }),
});
