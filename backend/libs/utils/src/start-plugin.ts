import * as dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSubgraphSchema } from '@apollo/subgraph';
// import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
// import * as ws from 'ws';
// import { filterXSS } from 'xss';
// import { debugError, debugInfo } from '../debuggers';

import { ILogDoc } from '../../core-types';
import { Request as ApiRequest, Response as ApiResponse } from 'express';
import { DocumentNode } from 'graphql';
import { wrapMutations } from './apollo/wrapperMutations';
import { extractUserFromHeader } from './headers';
import { sendWorkerQueue } from './mq-worker';
import { getServices, join, leave } from './service-discovery';
const { PORT, USE_BRAND_RESTRICTIONS } = process.env;

type ApiHandler = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  resolver: (req: ApiRequest, res: ApiResponse) => Promise<void> | void;
};
type GraphqlResolver = {
  [key: string]: {
    [key: string]: (...args: any[]) => any;
  };
};
type ConfigTypes = {
  name: string;
  graphql: () => Promise<{
    resolvers: GraphqlResolver;
    typeDefs: DocumentNode;
  }>;
  apolloServerContext: (
    context: any,
    req: ApiRequest,
    res: ApiResponse,
  ) => Promise<void>;
  onServerInit: (app: express.Express) => Promise<void>;
  meta?: any;
  importExportTypes?: any;
  middlewares?: any;
  apiHandlers?: ApiHandler[];
  hasSubscriptions?: boolean;
  corsOptions?: any;
  subscriptionPluginPath?: any;
};

export async function startPlugin(
  configs: ConfigTypes,
): Promise<express.Express> {
  const port = process.env.PORT ? Number(process.env.PORT) : 3300;

  const app = express();
  app.disable('x-powered-by');

  // for health check
  app.get('/health', async (_req, res) => {
    res.end('ok');
  });
  if (configs.middlewares) {
    for (const middleware of configs.middlewares) {
      app.use(middleware);
    }
  }

  if (configs.apiHandlers) {
    const apiHandlers = configs.apiHandlers || [];
    for (const handler of apiHandlers) {
      const { method, path, resolver } = handler;

      const METHODS = {
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        PATCH: 'patch',
        DELETE: 'delete',
      };

      const METHOD = METHODS[method];

      app[METHOD](path, async (req: ApiRequest, res: ApiResponse) => {
        const startDate = new Date();
        const startTime = performance.now();

        const logDoc: ILogDoc = {
          source: 'webhook',
          action: method,
          payload: {
            headers: req.headers,
            body: req.body,
            query: req?.query,
          },
          userId: extractUserFromHeader(req.headers)?._id,
        };
        try {
          const result = await resolver(req, res);

          const endTime = performance.now();
          const durationMs = endTime - startTime;
          logDoc.payload.result = result;
          logDoc.executionTime = {
            startDate,
            endDate: new Date(),
            durationMs: durationMs,
          };
          logDoc.status = 'success';
          sendWorkerQueue('logs', 'put_log').add('put_log', logDoc);
          return result;
        } catch (e) {
          const errorDetails = {
            message: e.message || 'Unknown error',
            stack: e.stack || 'No stack available',
            name: e.name || 'Error',
          };

          logDoc.payload.result = errorDetails;
          logDoc.status = 'failed';
          // changeQueue.add("changeQueue", queueData);
          sendWorkerQueue('logs', 'put_log').add('put_log', logDoc);
          throw new Error(e);
        }
      });
    }
  }

  app.use(cors(configs.corsOptions || {}));

  app.use(cookieParser());

  if (configs.hasSubscriptions) {
    app.get('/subscriptionPlugin.js', async (req, res) => {
      res.sendFile(path.join(configs.subscriptionPluginPath));
    });
  }

  app.use((req: any, _res, next) => {
    req.rawBody = '';

    req.on('data', (chunk) => {
      req.rawBody += chunk.toString();
    });

    next();
  });

  // Error handling middleware
  app.use((error, _req, res, _next) => {
    // const msg = filterXSS(error.message);
    const msg = error.message;

    // debugError(`Error: ${msg}`);

    res.status(500).send(msg);
  });

  const httpServer = http.createServer(app);

  // GRACEFULL SHUTDOWN
  process.stdin.resume(); // so the program will not close instantly

  async function closeHttpServer() {
    try {
      await new Promise<void>((resolve, reject) => {
        // Stops the server from accepting new connections and finishes existing connections.
        httpServer.close((error: Error | undefined) => {
          if (error) {
            return reject(error);
          }
          resolve();
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function leaveServiceDiscovery() {
    try {
      await leave(configs.name, port);
      console.log(`Left service discovery. name=${configs.name} port=${PORT}`);
    } catch (e) {
      console.error(e);
    }
  }

  // If the Node process ends, close the Mongoose connection
  (['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
    process.on(sig, async () => {
      await closeHttpServer();
      await leaveServiceDiscovery();
      process.exit(0);
    });
  });

  const generateApolloServer = async () => {
    const services = await getServices();
    // debugInfo(`Enabled services .... ${JSON.stringify(services)}`);

    const { typeDefs, resolvers } = await configs.graphql();

    return new ApolloServer({
      schema: buildSubgraphSchema([
        {
          typeDefs,
          resolvers: {
            ...resolvers,
            Mutation: wrapMutations(resolvers?.Mutation || {}),
          },
        },
      ]),

      // for graceful shutdown
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
  };

  const apolloServer = await generateApolloServer();
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
        let user: any = extractUserFromHeader(req.headers);

        let context;

        if (USE_BRAND_RESTRICTIONS !== 'true') {
          context = {
            brandIdSelector: {},
            singleBrandIdSelector: {},
            userBrandIdsSelector: {},
            docModifier: (doc) => doc,
            commonQuerySelector: {},
            user,
            res,
          };
        } else {
          let scopeBrandIds = JSON.parse(req.cookies.scopeBrandIds || '[]');
          let brandIds = [];
          let brandIdSelector = {};
          let commonQuerySelector = {};
          let commonQuerySelectorElk;
          let userBrandIdsSelector = {};
          let singleBrandIdSelector = {};

          if (user) {
            brandIds = user.brandIds || [];

            if (scopeBrandIds.length === 0) {
              scopeBrandIds = brandIds;
            }

            if (!user.isOwner && scopeBrandIds.length > 0) {
              brandIdSelector = { _id: { $in: scopeBrandIds } };
              commonQuerySelector = { scopeBrandIds: { $in: scopeBrandIds } };
              commonQuerySelectorElk = { terms: { scopeBrandIds } };
              userBrandIdsSelector = { brandIds: { $in: scopeBrandIds } };
              singleBrandIdSelector = { brandId: { $in: scopeBrandIds } };
            }
          }

          context = {
            brandIdSelector,
            singleBrandIdSelector,
            docModifier: (doc) => ({ ...doc, scopeBrandIds }),
            commonQuerySelector,
            commonQuerySelectorElk,
            userBrandIdsSelector,
            user,
            req,
            res,
          };
        }

        await configs.apolloServerContext(context, req, res);

        return context;
      },
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );

  //   if (configs.freeSubscriptions) {
  //     const wsServer = new ws.Server({
  //       server: httpServer,
  //       path: '/subscriptions',
  //     });

  //     await configs.freeSubscriptions(wsServer);
  //   }

  console.log(
    `🚀 ${configs.name} graphql api ready at http://localhost:${PORT}/graphql`,
  );

  if (configs.meta) {
  } // end configs.meta if

  await join({
    name: configs.name,
    port,
    hasSubscriptions: configs.hasSubscriptions,
    importExportTypes: configs.importExportTypes,
    meta: configs.meta,
  });

  configs.onServerInit(app);

  //   applyInspectorEndpoints(configs.name);

  //   debugInfo(`${configs.name} server is running on port: ${PORT}`);

  return app;
}

export default startPlugin;
