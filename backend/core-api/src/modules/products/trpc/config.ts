import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from '~/init-trpc';

const t = initTRPC.context<ITRPCContext>().create();

export const productConfigTrpcRouter = t.router({
  productConfigs: t.router({
    getConfig: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { code, defaultValue } = input;
      const { models } = ctx;

      return models.ProductsConfigs.getConfig(code, defaultValue);
    }),
  }),
});
