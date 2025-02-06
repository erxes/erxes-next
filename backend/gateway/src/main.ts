import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import { spawn } from 'child_process';

import { ErxesProxyTarget, retryGetProxyTargets } from './proxy/targets';
import { startRouter, stopRouter } from './apollo-router';
import { applyProxiesCoreless, applyProxyToCore } from './proxy/middleware';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const domain = process.env.DOMAIN ?? 'http://localhost:3000';

const corsOptions = {
  credentials: true,
  origin: [domain],
};

const app = express();

app.get('/stop-test', async (req, res) => {
  await updateProxyTargets(['core']);
  res.sendStatus(200);
});

app.get('/restart', async (req, res) => {
  await updateProxyTargets(['core', 'core-test']);
  res.sendStatus(200);
});

let currentTargets: ErxesProxyTarget[] = [];
let httpServer: http.Server;
let routerProcess: any; // Keeps track of the router process to stop it later

async function updateProxyTargets(aa: string[] = ['core', 'core-test']) {
  try {
    const newTargets = await retryGetProxyTargets(aa);

    // Check if the targets have changed
    if (JSON.stringify(newTargets) !== JSON.stringify(currentTargets)) {
      console.log('Proxy targets updated, applying changes...');

      // Update the targets and apply the new proxy middleware
      currentTargets = newTargets;

      // Re-apply the proxy middlewares to the app
      applyProxiesCoreless(app, currentTargets);

      console.log('New proxy targets applied successfully.');

      // Restart the router with updated targets
      await restartRouter();
    }
  } catch (error) {
    console.error('Error updating proxy targets:', error);
  }
}

async function restartRouter() {
  try {
    // Stop the existing router process (if it exists)
    if (routerProcess) {
      console.log('Stopping existing router process...');
      routerProcess.kill('SIGINT'); // Gracefully stop the current process
    }

    // Start the router again with the updated targets
    console.log('Starting the router with updated targets...');
    await startRouter(currentTargets);
  } catch (error) {
    console.error('Error during router restart:', error);
  }
}

async function start() {
  try {
    app.use(cors(corsOptions));
    app.use(cookieParser());

    // Initial fetch of the proxy targets
    currentTargets = await retryGetProxyTargets();

    // Start the router with the initial targets
    await startRouter(currentTargets);

    // Apply the initial proxy middleware
    applyProxiesCoreless(app, currentTargets);
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
(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
  process.on(sig, async () => {
    console.log(`Exiting on signal ${sig}`);
    await stopRouter(sig);
    httpServer.close(() => {
      console.log('Server shut down gracefully');
      process.exit(0);
    });
  });
});

start();
