import { getEnv, startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { router } from '~/routes';
import { initializeCallQueueMonitoring } from '~/modules/integrations/call/worker/callDashboard';
import automations from './meta/automations';
import initCallApp from '~/modules/integrations/call/initApp';

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
  onServerInit: async (app) => {
    await initCallApp(app);

    try {
      if (getEnv({ name: 'CALL_DASHBOARD_ENABLED' })) {
        await initializeCallQueueMonitoring();
      }
    } catch (error) {
      console.error('Failed to initialize call queue monitoring:', error);
    }
  },

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
    // afterProcess: {
    //   rules: [
    //     { type: 'updatedDocument', contentTypes: ['core:user'] },
    //     { type: 'afterAuth', types: ['login'] },
    //     { type: 'afterMutation', mutationNames: ['usersEdit'] },
    //   ],
    //   onDocumentUpdated: async ({ subdomain }, data) => {
    //     // do logic
    //   },
    //   onAfterAuth: async (context, data) => {
    //     // do logic
    //   },
    //   onAfterMutation: (context, args) => {
    //     // do logic
    //   },
    // },
  },
});
