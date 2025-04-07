import { initTRPC } from '@trpc/server';
import { customerTRPCSchema, customerDocumentTRPCSchema } from 'erxes-api-rpc';
import { z } from 'zod';
import { generateModels, IModels } from '../db/connectionResolvers';

const t = initTRPC.context<{ models: IModels }>().create();

export const logsRouter = t.router({
  log: t.router({
    list: t.procedure
      .input(generateModels)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .query(async ({ input, ctx }) => {
        const { ...query } = input;
        const { models } = ctx;
        const logs = await models.Logs.find({ ...query });

        return logs;
      }),

    get: t.procedure
      .output(z.union([customerDocumentTRPCSchema, z.null()]))
      .query(async () => {
        return null;
      }),
  }),
});
