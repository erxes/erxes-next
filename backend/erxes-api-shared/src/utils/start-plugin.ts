import * as dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { Application } from 'express';

import * as http from 'http';

dotenv.config();

import * as trpcExpress from '@trpc/server/adapters/express';
import { AnyRouter } from '@trpc/server/dist/unstable-core-do-not-import';
import { Request as ApiRequest, Response as ApiResponse } from 'express';
import { DocumentNode, GraphQLScalarType } from 'graphql';
import { wrapApolloMutations } from './apollo/wrapperMutations';
import { extractUserFromHeader } from './headers';
import { logHandler } from './logs';
import { joinErxesGateway, leaveErxesGateway } from './service-discovery';
import { generateApolloContext } from './apollo';
import { closeMongooose } from './mongo';
import { AutomationConfigs } from '../core-modules/automations/types';
import { startAutomations } from '../core-modules';
import { getSubdomain } from './utils';

const { PORT, USE_BRAND_RESTRICTIONS } = process.env;

type IMeta = {
  automations?: AutomationConfigs;
};

type ApiHandler = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  resolver: (req: ApiRequest, res: ApiResponse) => Promise<void> | void;
};
type ResolverObject = {
  [key: string]: (...args: any[]) => any;
};

type GraphqlResolver = {
  [key: string]: ResolverObject | GraphQLScalarType;
};

type ConfigTypes = {
  name: string;
  graphql: () => Promise<{
    resolvers: GraphqlResolver;
    typeDefs: DocumentNode;
  }>;
  apolloServerContext: (
    subdomain: string,
    context: any,
    req: ApiRequest,
    res: ApiResponse,
  ) => Promise<void>;
  onServerInit: (app: express.Express) => Promise<void>;
  importExportTypes?: any;
  middlewares?: any;
  apiHandlers?: ApiHandler[];
  hasSubscriptions?: boolean;
  corsOptions?: any;
  subscriptionPluginPath?: any;
  trpcAppRouter?: AnyRouter;
  meta?: IMeta;
};

export async function startPlugin(
  configs: ConfigTypes,
): Promise<express.Express> {
  const port = process.env.PORT ? Number(process.env.PORT) : 3300;

  const app = express();
  app.disable('x-powered-by');
  app.use(cors(configs.corsOptions || {}));

  app.use(cookieParser());

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
      } as const;

      type Method = keyof typeof METHODS;
      type LowercaseMethod = (typeof METHODS)[Method];

      // Ensure `method` is one of the keys
      const METHOD = METHODS[method as Method] as LowercaseMethod;

      (app as Record<LowercaseMethod, Application[LowercaseMethod]>)[METHOD](
        path,
        async (req: ApiRequest, res: ApiResponse) => {
          return await logHandler(async () => await resolver(req, res), {
            subdomain: getSubdomain(req),
            source: 'webhook',
            action: method,
            payload: {
              headers: req.headers,
              body: req.body,
              query: req?.query,
            },
            userId: extractUserFromHeader(req.headers)?._id,
          });
        },
      );
    }
  }

  // if (configs.hasSubscriptions) {
  //   app.get('/subscriptionPlugin.js', async (req, res) => {
  //     res.sendFile(path.join(configs.subscriptionPluginPath));
  //   });
  // }

  if (configs.trpcAppRouter) {
    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: configs.trpcAppRouter,
        createContext: () => {
          return {
            subdomain: 'os',
          };
        },
      }),
    );
  }

  app.use((req: any, _res, next) => {
    req.rawBody = '';

    req.on('data', (chunk: any) => {
      req.rawBody += chunk.toString();
    });

    next();
  });

  // Error handling middleware
  app.use((error: any, _req: any, res: any, _next: any) => {
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
      await leaveErxesGateway(configs.name, port);
      console.log(`Left service discovery. name=${configs.name} port=${port}`);
    } catch (e) {
      console.error(e);
    }
  }

  // If the Node process ends, close the Mongoose connection
  (['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
    process.on(sig, async () => {
      console.log('daczx');
      await closeHttpServer();
      await closeMongooose();
      await leaveServiceDiscovery();
      process.exit(0);
    });
  });

  const generateApolloServer = async () => {
    // const services = await getServices();
    // debugInfo(`Enabled services .... ${JSON.stringify(services)}`);

    const { typeDefs, resolvers } = await configs.graphql();

    return new ApolloServer({
      schema: buildSubgraphSchema([
        {
          typeDefs,
          resolvers: {
            ...resolvers,
            Mutation: wrapApolloMutations(
              (resolvers?.Mutation || {}) as ResolverObject,
            ),
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
      context: generateApolloContext(configs.apolloServerContext),
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );

  console.log(
    `🚀 ${configs.name} graphql api ready at http://localhost:${port}/graphql`,
  );

  if (configs.meta) {
    const { automations } = configs.meta || {};

    if (automations) {
      startAutomations(configs.name, automations);
    }
  } // end configs.meta if

  await joinErxesGateway({
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
