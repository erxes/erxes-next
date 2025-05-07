import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import * as http from 'http';
import { initApolloServer } from '~/apollo/apolloServer';

import { joinErxesGateway, leaveErxesGateway } from 'erxes-api-shared/utils';
import { router } from '~/routes';

const port = process.env.PORT ? Number(process.env.PORT) : 3302;
export const DOMAIN = process.env.DOMAIN || 'http://localhost:3000';
console.log('PORT', port);
console.log('DOMAIN', DOMAIN);
const app = express();

app.use(express.urlencoded({ limit: '15mb', extended: true }));

app.use(
  express.json({
    limit: '15mb',
  }),
);

app.use(router);

app.use(cookieParser());

const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  await initApolloServer(app, httpServer);

  await joinErxesGateway({
    name: 'frontline',
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
    await leaveErxesGateway('frontline', port);
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
    console.log(`Received ${sig}, shutting down...`);
    await closeHttpServer();
    await closeMongooose();
    await leaveServiceDiscovery();

    setTimeout(() => {
      process.exit(0);
    }, 500); // 500ms хүлээх
  });
});
