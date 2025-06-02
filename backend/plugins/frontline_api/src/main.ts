import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';

startPlugin({
  name: 'frontline',
  port: 3302,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),

  // hasSubscriptions: false,
  // subscriptionPluginPath: require('path').resolve(
  //   __dirname,
  //   'graphql',
  //   'subscriptionPlugin.js',
  // ),
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
});
