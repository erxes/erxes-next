import { generateModels } from '@erxes/api-utils';
import { IModels } from './models';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

export default {
  name: 'test',
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers: await resolvers(),
    };
  },
  apolloServerContext: async (context, req) => {
    const models = await generateModels<IModels>(req);

    context.models = models;

    return context;
  },
};
