import { initTRPC } from '@trpc/server';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { z } from 'zod';

const t = initTRPC.context<ITRPCContext>().create();

export const exchangeRateTrpcRouter = t.router({
  exchangeRates: t.router({
    findOne: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { models } = ctx;
      const { query } = input;
      await models.ExchangeRates.findOne(query).lean();
    }),
    create: t.procedure.input(z.any()).mutation(async ({ ctx, input }) => {
      const { data } = input;
      const { models } = ctx;
      return await models.ExchangeRates.createExchangeRate(data);
    }),
    update: t.procedure.input(z.any()).mutation(async ({ ctx, input }) => {
      const { selector, modifier } = input;
      const { models } = ctx;
      return await models.ExchangeRates.updateOne(selector, modifier);
    }),
    getActiveRate: t.procedure.input(z.any()).query(async ({ ctx, input }) => {
      const { date, rateCurrency, mainCurrency } = input;
      const { models } = ctx;
      return await models.ExchangeRates.getActiveRate({
        date,
        rateCurrency,
        mainCurrency,
      });
    }),
  }),
});
