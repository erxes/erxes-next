import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { gql } from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';
import * as dotenv from 'dotenv';
import { getSubdomain } from 'erxes-api-utils';
import { extractUserFromHeader } from 'erxes-api-utils';

// load environment variables
dotenv.config();

let apolloServer;

export const initApolloServer = async (app, httpServer) => {
  const typeDefs = async () => {
    return gql(`
       type Lol {
        id: String
        name: String
      }

      extend type Query {
        getLol: Lol
      }

    `);
  };

  apolloServer = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs: await typeDefs(),
      },
    ]),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

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
        };
      },
    }),
  );

  return apolloServer;
};

export default apolloServer;
