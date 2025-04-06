import { startPlugin } from 'erxes-api-utils';
import configs from './configs';

import { getSubdomain } from 'erxes-api-utils';
import { generateModels } from './db/connectionResolvers';
import resolvers from './apollo/resolvers';
import typeDefs from './apollo/typeDef';

startPlugin({
  name: 'logs',
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers,
    };
  },
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.subdomain = subdomain;

    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },

  meta: {},

  onServerInit: async () => {},
});
