import { initTRPC } from '@trpc/server';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { z } from 'zod';
import { generateModels, IModels } from '~/connectionResolvers';

const t = initTRPC.context<ITRPCContext<{ models: IModels }>>().create();

export const automationsRouter = t.router({
  automation: t.router({
    find: t.procedure
      .input(z.object({ query: z.any() }))
      .query(async ({ input, ctx }) => {
        const { query } = input;
        const { models } = ctx;
        return await models.Automations.find({
          'triggers.type': query.triggerType,
          'triggers.config.botId': query.botId,
          status: 'active',
        }).lean();
      }),

    count: t.procedure
      .input(z.object({ query: z.any() }))
      .query(async ({ input, ctx }) => {
        const { query } = input;
        const { models } = ctx;
        return await models.Automations.countDocuments(query);
      }),
  }),
  executions: t.router({
    find: t.procedure
      .input(z.object({ query: z.any() }))
      .query(async ({ input, ctx }) => {
        const { ...query } = input;
        const { models } = ctx;
        return await models.Executions.find(query);
      }),
  }),
});
