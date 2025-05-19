import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { ITRPCContext } from '~/init-trpc';
import {
  generateContactsFields,
  generateFieldsUsers,
  generateFormFields,
  generateProductsFields,
} from '../fields/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const fieldsTrpcRouter = t.router({
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
    getFieldList: t.procedure
      .input(
        z.object({
          type: z.string(),
          segmentId: z.string().optional(),
          usageType: z.string().optional(),
          config: z.record(z.any()).optional(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const { subdomain } = ctx;
        const { type } = input;

        switch (type) {
          case 'lead':
            return generateContactsFields({ subdomain, data: input });
          case 'customer':
            return generateContactsFields({ subdomain, data: input });

          case 'company':
            return generateContactsFields({ subdomain, data: input });

          case 'product':
            return generateProductsFields({ subdomain, data: input });

          case 'form_submission':
            return generateFormFields({ subdomain, data: input });

          default:
            return generateFieldsUsers({ subdomain, data: input });
        }
      }),
  }),
});
