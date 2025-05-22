import { ApolloServer } from 'apollo-server-express';
import { IModels } from '../modules/ll/types';
import { typeDefs } from './schema/schema';
import { resolvers } from './resolvers';

export const loadApolloServer = async (models: IModels) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      models,
      subdomain: req.headers.subdomain,
      user: req.user,
    }),
  });

  return server;
};
