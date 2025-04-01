import { initTRPC } from '@trpc/server';
import { generateModels } from '../../../connectionResolvers';
import { customerTRPCSchema, customerDocumentTRPCSchema } from 'erxes-api-rpc';
import { z } from 'zod';

const t = initTRPC.create();

export const customerRouter = t.router({
  customer: t.router({
    list: t.procedure
      .input(generateModels)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .query(async ({ input }) => {
        const { ...rest } = input;

        const query = { ...rest };

        const models = await generateModels('os');

        const sda = {
          _id: 'dHDg9dxhfWq5GpH9Y9sUM',
          state: 'visitor',
          avatar: null,
          firstName: 'adsda',
          lastName: 'sadasd',
          middleName: '',
          sex: 0,
          primaryEmail: 'asdasd@gmail.com',
          emails: ['asdasd@gmail.com'],
          emailValidationStatus: 'valid',
          primaryPhone: '99126730',
          phones: ['99126730'],
          addresses: [],
          phoneValidationStatus: 'unknown',
          status: 'Active',
          description: '',
        };

        return null;
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
