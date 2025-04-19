import { initTRPC } from '@trpc/server';
import { generateModels } from '~/connectionResolvers';

const t = initTRPC.create();

export const companyTrpcRouter = t.router({
  company: t.router({
    list: t.procedure.query(async () => {
      const subdomain = 'os';
      const models = await generateModels(subdomain);

      return models.Companies.find({});
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
