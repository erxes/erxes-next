import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const permissionTrpcRouter = t.router({
  permissions: t.router({
    find: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { models } = ctx;
      const { query } = input;

      return await models.Permissions.find(query);
    }),
  }),
});
