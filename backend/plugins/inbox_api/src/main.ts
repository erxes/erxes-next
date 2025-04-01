import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import * as http from 'http';
import { initApolloServer } from './apollo/apolloServer';
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';
import { CoreTRPCAppRouter } from 'erxes-api-rpc';

import { getService, join, leave } from 'erxes-api-utils';

const port = process.env.PORT ? Number(process.env.PORT) : 3301;

const app = express();

app.use(express.urlencoded({ limit: '15mb', extended: true }));

app.get('/users', async (_req, res) => {
  const coreService = await getService('core');
  try {
    const client = createTRPCClient<CoreTRPCAppRouter>({
      links: [
        httpBatchStreamLink({
          url: `${coreService.address}/trpc`,
        }),
      ],
    });

    const customers = await client.customer.list.query({});

    console.log(customers);

    res.json([{ firstName: '123123' }]);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.use(
  express.json({
    limit: '15mb',
  }),
);

app.use(cookieParser());

const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  await initApolloServer(app, httpServer);

  await join({
    name: 'inbox',
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
    await leave('inbox', port);
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
