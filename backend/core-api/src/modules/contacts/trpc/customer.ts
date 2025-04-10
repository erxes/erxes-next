import { initTRPC } from '@trpc/server';
import { generateModels } from '~/connectionResolvers';

const t = initTRPC.create();

export const customerRouter = t.router({
  customer: t.router({
    list: t.procedure.input(generateModels).query(async () => {
      return null;
    }),

    get: t.procedure.query(async () => {
      return null;
    }),

    create: t.procedure.mutation(async () => {
      return null;
    }),

    update: t.procedure.mutation(async () => {
      return null;
    }),

    delete: t.procedure.mutation(async () => {
      return null;
    }),
  }),
});
