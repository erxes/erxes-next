import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import * as http from 'http';
import { initApolloServer } from './apolloClient';

import { join, leave } from 'erxes-api-utils';

const { WIDGETS_DOMAIN, DOMAIN, CLIENT_PORTAL_DOMAINS } = process.env;

const port = process.env.PORT ? Number(process.env.PORT) : 3400;

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
    DOMAIN ? DOMAIN : 'http://localhost:3000',
    WIDGETS_DOMAIN ? WIDGETS_DOMAIN : 'http://localhost:3200',
    ...(CLIENT_PORTAL_DOMAINS || '').split(','),
    ...(process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((c) => c && RegExp(c)),
  ],
};

app.use(cors(corsOptions));

// app.post('/webhooks/:id', webhookMiddleware);

// Wrap the Express server
const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  await initApolloServer(app, httpServer);

  await join({
    name: 'core-test',
    port,
    hasSubscriptions: false,
    meta: {},
  });
});

// GRACEFULL SHUTDOWN
process.stdin.resume(); // so the program will not close instantly

async function closeMongooose() {
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection disconnected ');
  } catch (e) {
    console.error(e);
  }
}

async function leaveServiceDiscovery() {
  try {
    await leave('core-test', port);
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
