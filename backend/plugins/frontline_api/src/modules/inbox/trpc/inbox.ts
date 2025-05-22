import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const inboxTrpcRouter = t.router({
  inbox: t.router({
    getConversations: t.procedure
      .input(z.any())
      .query(async ({ ctx, input }) => {
        const { query } = input;
        const { models } = ctx;

        return await models.Conversations.find(query).lean();
      }),
    removeCustomersConversations: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerIds } = input;
        const { models } = ctx;

        return await models.Conversations.removeCustomersConversations(
          customerIds,
        );
      }),
    changeCustomer: t.procedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        const { customerId, customerIds } = input;
        const { models } = ctx;

        return await models.Conversations.changeCustomer(
          customerId,
          customerIds,
        );
      }),
  }),
});
