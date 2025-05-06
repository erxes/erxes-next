import { initTRPC } from '@trpc/server';
import { generateModels, IModels } from '../db/connectionResolvers';

const t = initTRPC.context<{ models: IModels }>().create();

export const automationsRouter = t.router({
  automation: t.router({
    list: t.procedure.input(generateModels).query(async ({ input, ctx }) => {
      const { ...query } = input;
      const { models } = ctx;
      const autoamtions = await models.Automations.find({ ...query });

      return autoamtions;
    }),

    get: t.procedure.query(async () => {
      return null;
    }),
  }),
});
