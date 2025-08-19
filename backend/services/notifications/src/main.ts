import { debugError, debugInfo } from '@/utils/debugger';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
  closeMongooose,
  createHealthRoute,
  isDev,
  keyForConfig,
  redis,
} from 'erxes-api-shared/utils';
import express from 'express';
import * as http from 'http';
import { initMQWorkers } from './bullmq';

const {
  DOMAIN,
  CLIENT_PORTAL_DOMAINS,
  ALLOWED_DOMAINS,
  PORT,
  LOAD_BALANCER_ADDRESS,
  MONGO_URL,
} = process.env;

const port = PORT ? Number(PORT) : 3308;

const serviceName = 'notifications-service';

const app = express();

// Middleware setup
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
    ALLOWED_DOMAINS || 'http://localhost:3200',
    ...(CLIENT_PORTAL_DOMAINS || '').split(','),
    ...(process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  ],
};
// cors
app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', createHealthRoute(serviceName));

const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  debugInfo(`Notification service listening on port ${port}`);

  await redis.set(
    keyForConfig(serviceName),

    JSON.stringify({
      dbConnectionString: MONGO_URL,
    }),
  );

  const address =
    LOAD_BALANCER_ADDRESS ||
    `http://${isDev ? 'localhost' : serviceName}:${port}`;

  await redis.set(`service-logs`, address);

  console.log(`service-logs joined with ${address}`);

  await initMQWorkers(redis);
  debugInfo('Notification service started successfully');
});

process.stdin.resume();

async function leaveServiceDiscovery() {
  try {
    console.log(`$service-logs left ${port}`);
    debugInfo('Left from service discovery');
  } catch (e) {
    debugError(e);
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
    debugError(e);
  }
}

// Graceful shutdown
(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
  process.on(sig, async () => {
    debugInfo(`Received ${sig}, shutting down gracefully...`);
    await closeHttpServer();
    await closeMongooose();
    await leaveServiceDiscovery();
    process.exit(0);
  });
});
