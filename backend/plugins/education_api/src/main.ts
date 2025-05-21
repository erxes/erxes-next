import { startPlugin } from 'erxes-api-shared/utils';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { typeDefs } from '~/apollo/typeDefs';

startPlugin({
  name: 'education',
  port: 3322,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers: resolvers,
  }),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },
});
