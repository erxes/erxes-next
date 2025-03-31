import { initTRPC } from '@trpc/server';
import { generateModels } from '../../../connectionResolvers';
import { customerTRPCSchema, customerDocumentTRPCSchema } from 'erxes-api-rpc';
import { z } from 'zod';

const t = initTRPC.create();

export const customerRouter = t.router({
  customer: t.router({
    list: t.procedure
      .input(customerTRPCSchema)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .query(async () => {
        const models = await generateModels('os');

        return models.Customers.find({});
      }),

    get: t.procedure
      .output(z.union([customerDocumentTRPCSchema, z.null()]))
      .query(async () => {
        return null;
      }),

    create: t.procedure
      .input(customerTRPCSchema)
      .output(z.union([customerDocumentTRPCSchema, z.null()]))
      .mutation(async () => {
        return null;
      }),

    update: t.procedure
      .input(customerDocumentTRPCSchema)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .mutation(async () => {
        return null;
      }),

    delete: t.procedure
      .input(customerDocumentTRPCSchema)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .mutation(async () => {
        return null;
      }),
  }),
});
