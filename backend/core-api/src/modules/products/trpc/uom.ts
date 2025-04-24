import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const uomTrpcRouter = t.router({
  uoms: t.router({
    find: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;

      const { models } = ctx;

      const uoms = await models.Uoms.find(query).lean();

      return uoms;
    }),

    findOne: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { query } = input;

      const { models } = ctx;

      const uom = await models.Uoms.findOne(query).lean();

      return uom;
    }),
  }),
});
