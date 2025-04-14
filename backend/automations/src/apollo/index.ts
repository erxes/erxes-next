import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSubgraphSchema } from '@apollo/subgraph';
import * as dotenv from 'dotenv';
import { extractUserFromHeader, getSubdomain } from 'erxes-api-shared/utils';
import { generateModels } from '../db/connectionResolvers';
import resolvers from './resolvers';
import typeDefs from './typeDef';

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
  console.log('automations-api');

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        if (
          req.body.operationName === 'IntrospectionQuery' ||
          req.body.operationName === 'SubgraphIntrospectQuery'
        ) {
          return {};
        }
        const subdomain = getSubdomain(req);
        const models = await generateModels(subdomain);

        const user: any = extractUserFromHeader(req.headers);

        const requestInfo = {
          secure: req.secure,
          cookies: req.cookies,
        };

        return {
          user,
          res,
          requestInfo,
          subdomain,
          models,
        };
      },
    }),
  );

  return apolloServer;
};

export default initApolloServer;
