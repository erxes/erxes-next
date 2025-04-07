import { redis, startPlugin } from 'erxes-api-utils';

import { getSubdomain } from 'erxes-api-utils';
import { generateModels } from './db/connectionResolvers';
import resolvers from './apollo/resolvers';
import typeDefs from './apollo/typeDef';
import { initMQWorkers } from './bullmq';

startPlugin({
  name: 'logs',
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  apolloServerContext: async (subdomain, context, req) => {
    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },

  meta: {},

  onServerInit: async () => {
    await initMQWorkers(redis);
  },
});
