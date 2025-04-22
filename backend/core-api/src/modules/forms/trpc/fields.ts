import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const fieldsRouter = t.router({
  fields: t.router({
    findOne: t.procedure
      .input(z.object({ _id: z.string() }))
      .query(async ({ ctx, input }) => {
        const { _id } = input;
        const { models } = ctx;
        return await models.Fields.findOne({ _id });
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
      }),

    generateTypedItem: t.procedure
      .input(
        z.object({
          field: z.string(),
          value: z.string(),
          type: z.string(),
          validation: z.string(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const { models } = ctx;
        const { field, validation, value, type } = input;

        return await models.Fields.generateTypedItem(
          field,
          value,
          type,
          validation,
        );
      }),
  }),
});
