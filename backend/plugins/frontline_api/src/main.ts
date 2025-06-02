import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { router } from '~/routes';

startPlugin({
  name: 'frontline',
  port: 3304,
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
  expressRouter: router,

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

  meta: {
    afterProcess: {
      rules: [
        { type: 'updatedDocument', contentTypes: ['core:user'] },
        { type: 'afterAuth', types: ['login'] },
        { type: 'afterMutation', mutationNames: ['usersEdit'] },
      ],
      onDocumentUpdated: async ({ subdomain }, data) => {
        // do logic
      },
      onAfterAuth: async (context, data) => {
        // do logic
      },
      onAfterMutation: (context, args) => {
        // do logic
      },
    },
  },
});
