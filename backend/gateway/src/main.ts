import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as http from 'http';

import { ErxesProxyTarget, retryGetProxyTargets } from './proxy/targets';
import { startRouter } from './apollo-router';
import {
  applyProxiesToGraphql,
  applyProxyToCore,
  proxyReq,
} from './proxy/middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const domain = process.env.DOMAIN ?? 'http://localhost:3000';

const corsOptions = {
  credentials: true,
  origin: [domain],
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/stop-test', async (req, res) => {
  await updateApolloRouter();
  res.sendStatus(200);
});

app.get('/restart', async (req, res) => {
  await updateApolloRouter();

  res.sendStatus(200);
});

app.use('/pl:serviceName', async (req, res) => {
  try {
    const services = { core: 'http://localhost:3400' };
    const serviceName = req.params.serviceName;

    // Find the target URL for the requested service
    const targetUrl = services[serviceName.replace(':', '')];

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

let currentTargets: ErxesProxyTarget[] = [];
let httpServer: http.Server;

async function updateApolloRouter() {
  try {
    const newTargets = await retryGetProxyTargets();

    // Check if the targets have changed
    if (JSON.stringify(newTargets) !== JSON.stringify(currentTargets)) {
      console.log('Proxy targets updated, applying changes...');

      // Update the targets and apply the new proxy middleware
      currentTargets = newTargets;

      // Restart the router with updated targets
      await startRouter(currentTargets);
    }
  } catch (error) {
    console.error('Error updating proxy targets:', error);
  }
}

async function start() {
  try {
    // Initial fetch of the proxy targets
    currentTargets = await retryGetProxyTargets();

    // Start the router with the initial targets
    await startRouter(currentTargets);

    // Apply the initial proxy middleware
    applyProxiesToGraphql(app);
    applyProxyToCore(app, currentTargets);

    // Start the HTTP server
    httpServer = http.createServer(app);

    // Listen for incoming requests
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`Server is running at http://localhost:${port}/`);

    // Periodically check for proxy target updates
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

// Graceful shutdown for SIGINT and SIGTERM

start();
