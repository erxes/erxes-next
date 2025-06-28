import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/init-trpc';
import { afterProcess } from '~/meta/afterProcess';
import { facebookAfterProcessWorkers } from '~/modules/integrations/facebook/meta/afterProcess/afterProcessWorkers';
import { router } from '~/routes';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import automations from './meta/automations';

const handler = {
  facebook: facebookAfterProcessWorkers.onDocumentCreated,
};

startPlugin({
  name: 'frontline',
  port: 3304,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),

  hasSubscriptions: true,
  subscriptionPluginPath: require('path').resolve(
    __dirname,
    'apollo',
    process.env.NODE_ENV === 'production'
      ? 'subscription.js'
      : 'subscription.ts',
  ),

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
    automations,
    afterProcess,
  },
});
