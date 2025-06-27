import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
  closeMongooose,
  isDev,
  joinErxesGateway,
  leaveErxesGateway,
  redis,
} from 'erxes-api-shared/utils';
import express from 'express';
import * as http from 'http';
import { initMQWorkers } from './bullmq';

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
    ...(DOMAIN ? [DOMAIN] : []),
    ...(isDev ? ['http://localhost:3001'] : []),
    ALLOWED_DOMAINS ? ALLOWED_DOMAINS : 'http://localhost:3200',
    ...(CLIENT_PORTAL_DOMAINS || '').split(','),
    ...(process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((c) => c && RegExp(c)),
  ],
};

app.use(cors(corsOptions));

// app.use(
//   '/trpc',
//   trpcExpress.createExpressMiddleware({
//     router: appRouter,
//     createContext: createTRPCContext(async (subdomain, context) => {
//       const models = await generateModels(subdomain);
//       context.models = models;
//       return context;
//     }),
//   }),
// );

const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  await joinErxesGateway({
    name: 'automations',
    port,
    hasSubscriptions: false,
    meta: {},
  });
  await initMQWorkers(redis);
});

process.stdin.resume();

async function leaveServiceDiscovery() {
  try {
    await leaveErxesGateway('automations', port);
    console.log('Left from service discovery');
  } catch (e) {
    console.error(e);
  }
}

async function closeHttpServer() {
  try {
    await new Promise<void>((resolve, reject) => {
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

(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
  process.on(sig, async () => {
    await closeHttpServer();
    await closeMongooose();
    await leaveServiceDiscovery();
    process.exit(0);
  });
});
