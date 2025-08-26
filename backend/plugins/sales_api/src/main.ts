import { startPlugin } from 'erxes-api-shared/utils';
import { appRouter } from '~/trpc/init-trpc';
import resolvers from './apollo/resolvers';
import { typeDefs } from './apollo/typeDefs';
import { generateModels } from './connectionResolvers';
import automations from '~/meta/automations';
import segments from '~/meta/segments';

startPlugin({
  name: 'sales',
  port: 3305,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers: resolvers,
  }),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },
  trpcAppRouter: {
    router: appRouter,
    createContext: async (subdomain, context) => {
      const models = await generateModels(subdomain);

      context.models = models;

      return context;
    },
  },
  meta: { automations, segments },
});
