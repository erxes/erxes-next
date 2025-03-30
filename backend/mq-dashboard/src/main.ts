import express from 'express';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

import { redis } from 'erxes-api-utils';

const port = process.env.PORT ? Number(process.env.PORT) : 4444;

const myQueue = new Queue('gateway-update-apollo-router', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullMQAdapter(myQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath('/bullmq-board');

const app = express();

app.use('/bullmq-board', serverAdapter.getRouter());

app.listen(port, () => {
  console.log(`BullMQ Board listening on port ${port}`);
});
