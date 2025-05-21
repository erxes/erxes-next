import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const unitTrpcRouter = t.router({
  units: t.router({
    find: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { models } = ctx;
      const { query, fields } = input;

      return await models.Units.find(query, fields).lean();
    }),

    findOne: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;
      const { models } = ctx;

      return await models.Units.findOne(query).lean();
    }),
  }),
});
