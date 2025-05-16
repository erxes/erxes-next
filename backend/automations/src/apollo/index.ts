import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSubgraphSchema } from '@apollo/subgraph';
import * as dotenv from 'dotenv';
import {
  extractUserFromHeader,
  generateApolloContext,
  getSubdomain,
} from 'erxes-api-shared/utils';
import { generateModels } from '../db/connectionResolvers';
import resolvers from './resolvers';
import typeDefs from './typeDef';
import { IMainContext } from 'erxes-api-shared/core-types';

// load environment variables
dotenv.config();

const generateApolloServer = async (httpServer) =>
  new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs: await typeDefs(),
        resolvers,
      },
    ]),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
export const initApolloServer = async (app, httpServer) => {
  const apolloServer = await generateApolloServer(httpServer);

  await apolloServer.start();
  console.log('shiadskjda:automations_api');

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: generateApolloContext<IMainContext>(
        async (subdomain, context) => {
          const models = await generateModels(subdomain);

          context.models = models;

          return context;
        },
      ),
    }),
  );

  return apolloServer;
};

export default initApolloServer;
