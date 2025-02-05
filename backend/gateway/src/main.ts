import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as http from 'http';

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

async function start() {
  app.use(cors(corsOptions));
  app.use(cookieParser());

  const targets: ErxesProxyTarget[] = await retryGetProxyTargets();

  await startRouter(targets);

  applyProxiesCoreless(app, targets);

  const httpServer = http.createServer(app);

  // httpServer.on('close', () => {
  //   try {
  //     pubsub.close();
  //   } catch (e) {
  //     console.log('PubSub client disconnected');
  //   }
  // });

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  applyProxyToCore(app, targets);

  console.log(`Erxes gateway ready at http://localhost:${port}/`);
}

start();

(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
  process.on(sig, async () => {
    console.log(`Exiting on signal ${sig}`);
    // await stopSubscriptionServer();
    await stopRouter(sig);
    process.exit(0);
  });
});
