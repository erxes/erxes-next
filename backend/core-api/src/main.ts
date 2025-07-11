import * as trpcExpress from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import * as http from 'http';
import { appRouter } from '~/init-trpc';
import { initApolloServer } from './apollo/apolloServer';
import { router } from './routes';
import { isDev } from 'erxes-api-shared/utils';

import {
  closeMongooose,
  createTRPCContext,
  joinErxesGateway,
  leaveErxesGateway,
} from 'erxes-api-shared/utils';

import './meta/automations';
import { generateModels } from './connectionResolvers';
import { moduleObjects } from './meta/permission';
import { tags } from './meta/tags';
import './segments';
import * as path from 'path';

const { DOMAIN, CLIENT_PORTAL_DOMAINS, ALLOWED_DOMAINS } = process.env;

const port = process.env.PORT ? Number(process.env.PORT) : 3300;

const app = express();

// don't move it above telnyx controllers
app.use(express.urlencoded({ limit: '15mb', extended: true }));

app.use(
  express.json({
    limit: '15mb',
  }),
);

app.use(cookieParser());

const corsOptions = {
  credentials: true,
  origin: [
    ...(DOMAIN ? [DOMAIN] : []),
    ...(isDev ? ['http://localhost:3001'] : []),
    ...(ALLOWED_DOMAINS || '').split(','),
    ...(CLIENT_PORTAL_DOMAINS || '').split(','),
    ...(process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((c) => c && RegExp(c)),
  ],
};

app.use(cors(corsOptions));
app.use(router);

app.get('/subscriptionPlugin.js', async (_req, res) => {
  const apolloSubscriptionPath = path.join(
    require('path').resolve(
      __dirname,
      'apollo',
      process.env.NODE_ENV === 'production'
        ? 'subscription.js'
        : 'subscription.ts',
    ),
  );

  res.sendFile(apolloSubscriptionPath);
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext(async (subdomain, context) => {
      const models = await generateModels(subdomain);

      context.models = models;

      return context;
    }),
  }),
);

app.get('/health', async (_req, res) => {
  res.end('ok');
});

// Wrap the Express server
const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  await initApolloServer(app, httpServer);

  await joinErxesGateway({
    name: 'core',
    port,
    hasSubscriptions: true,
    meta: {
      permissions: moduleObjects,
      tags,
    },
  });
});

// GRACEFULL SHUTDOWN
process.stdin.resume(); // so the program will not close instantly

async function leaveServiceDiscovery() {
  try {
    await leaveErxesGateway('core', port);
    console.log('Left from service discovery');
  } catch (e) {
    console.error(e);
  }
}

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

// If the Node process ends, close the http-server and mongoose.connection and leaveErxesGateway service discovery.
(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
  process.on(sig, async () => {
    await closeHttpServer();
    await closeMongooose();
    await leaveServiceDiscovery();
    process.exit(0);
  });
});
