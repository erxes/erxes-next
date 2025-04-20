import * as trpcExpress from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
  closeMongooose,
  getSubdomain,
  joinErxesGateway,
  leaveErxesGateway,
  redis,
} from 'erxes-api-shared/utils';
import express from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import { initApolloServer } from './apollo/index';
import { generateModels } from './db/connectionResolvers';
import { appRouter } from './trpc';
import { initMQWorkers } from './bullmq';
import { startAutomations } from 'erxes-api-shared/core-modules';

const { DOMAIN, CLIENT_PORTAL_DOMAINS, ALLOWED_DOMAINS, PORT } = process.env;

const port = PORT ? Number(PORT) : 3302;

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
    DOMAIN ? DOMAIN : 'http://localhost:3001',
    ALLOWED_DOMAINS ? ALLOWED_DOMAINS : 'http://localhost:3200',
    ...(CLIENT_PORTAL_DOMAINS || '').split(','),
    ...(process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((c) => c && RegExp(c)),
  ],
};

app.use(cors(corsOptions));

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: async ({ req }) => {
      const subdomain = getSubdomain(req);
      return {
        subdomain,
        models: await generateModels(subdomain),
      };
    },
  }),
);

// Wrap the Express server
const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  await initApolloServer(app, httpServer);

  await joinErxesGateway({
    name: 'automations-api',
    port,
    hasSubscriptions: false,
    meta: {},
  });
  await initMQWorkers(redis);
});

// GRACEFULL SHUTDOWN
process.stdin.resume(); // so the program will not close instantly

async function leaveServiceDiscovery() {
  try {
    await leaveErxesGateway('automations-api', port);
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

// If the Node process ends, close the http-server and mongoose.connection and leave service discovery.
(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
  process.on(sig, async () => {
    await closeHttpServer();
    await closeMongooose();
    await leaveServiceDiscovery();
    process.exit(0);
  });
});
