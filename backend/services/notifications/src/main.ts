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
import { debugError, debugInfo } from '@/utils/debugger';

const { DOMAIN, CLIENT_PORTAL_DOMAINS, ALLOWED_DOMAINS, PORT } = process.env;

const port = PORT ? Number(PORT) : 3303;

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
    ALLOWED_DOMAINS ? ALLOWED_DOMAINS : 'http://localhost:3200',
    ...(CLIENT_PORTAL_DOMAINS || '').split(','),
    ...(process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((c) => c && RegExp(c)),
  ],
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', async (_req, res) => {
  res.end('notification service ok');
});

const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  debugInfo(`Notification service listening on port ${port}`);

  await joinErxesGateway({
    name: 'notifications',
    port,
    hasSubscriptions: false,
    meta: {},
  });

  await initMQWorkers(redis);
  debugInfo('Notification service started successfully');
});

process.stdin.resume();

async function leaveServiceDiscovery() {
  try {
    await leaveErxesGateway('notifications', port);
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
