import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';

import { retryGetProxyTargets } from './proxy/targets';
import { startRouter, stopRouter } from './apollo-router';
import userMiddleware from './middlewares/userMiddleware';
import { initMQWorkers } from './mq/workers/workers';

import { CoreTRPCAppRouter } from 'erxes-api-rpc';

import {
  applyProxiesToGraphql,
  applyProxyToCore,
  proxyReq,
} from './proxy/middleware';

import { getServices, redis } from 'erxes-api-utils';
import { applyGraphqlLimiters } from './middlewares/graphql-limiter';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const domain = process.env.DOMAIN ?? 'http://localhost:3001';

const corsOptions = {
  credentials: true,
  origin: [domain],
};

const myQueue = new Queue('gateway-service-discovery', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: false,
  },
});

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullMQAdapter(myQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath('/bullmq-board');

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/users', async (req, res) => {
  try {
    const client = createTRPCClient<CoreTRPCAppRouter>({
      links: [
        httpBatchStreamLink({
          url: 'http://localhost:3300/trpc', // Plugin-User серверийн URL
        }),
      ],
    });

    const aa = await client.customer.list.query({});

    res.json(aa);
  } catch (error) {
    console.error('Error fetching users:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.use(userMiddleware);

app.use('/bullmq-board', serverAdapter.getRouter());

app.use('/pl:serviceName', async (req, res) => {
  try {
    const servicesArray: string[] = await getServices();

    const services: Record<string, string> = Object.fromEntries(
      servicesArray.map((service) => [service, service]),
    );

    const serviceName: string = req.params.serviceName.replace(':', '');

    initMQWorkers(redis);
    // Find the target URL for the requested service
    const targetUrl = services[serviceName];

    if (targetUrl) {
      // Proxy the request to the target service using the custom headers
      return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true, // Change the origin header to the target URL's origin
        on: {
          proxyReq,
        },
        pathRewrite: {
          [`^/pl:${serviceName}`]: '/', // Rewriting the path if needed
        },
      })(req, res); // Forward the request to the target service
    } else {
      // Service not found, return 404
      res.status(404).send('Service not found');
    }
  } catch {
    res.status(500).send('Error fetching services');
  }
});

let httpServer: http.Server;

async function start() {
  try {
    // Initial fetch of the proxy targets
    global.currentTargets = await retryGetProxyTargets();

    // Initialize MQ workers
    console.log('Initializing MQ workers...');
    await initMQWorkers(redis);
    console.log('MQ workers initialized');

    // Start the router with the initial targets
    console.log('Starting the router...');
    await startRouter(global.currentTargets);
    console.log('Router started successfully');

    // Apply the initial proxy middleware
    applyGraphqlLimiters(app);
    applyProxiesToGraphql(app);
    applyProxyToCore(app, global.currentTargets);

    // Start the HTTP server
    httpServer = http.createServer(app);
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`Server is running at http://localhost:${port}/`);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

// Graceful shutdown for SIGINT and SIGTERM
(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((signal) => {
  process.on(signal, async () => {
    console.log(`Exiting on signal ${signal}`);
    try {
      stopRouter(signal);
      if (httpServer) {
        await new Promise((resolve) => httpServer.close(resolve));
      }
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
});

start();
