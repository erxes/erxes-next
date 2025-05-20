import { initTRPC } from '@trpc/server';
import { generateModels, IModels } from '../db/connectionResolvers';
import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const logsRouter = t.router({
  log: t.router({
    list: t.procedure.input(generateModels).query(async ({ input, ctx }) => {
      const { ...query } = input;
      const { models } = ctx;
      const logs = await models.Logs.find({ ...query });

      return logs;
    }),

    get: t.procedure.query(async () => {
      return null;
    }),
  }),
});
