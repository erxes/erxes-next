import { Queue } from 'bullmq';
import { createMQWorkerWithListeners } from 'erxes-api-shared/utils';
import { dailyCheckCycles } from '~/worker/dailyCheckCycles';

export const initMQWorkers = async (redis: any) => {
  const myQueue = new Queue('operations-daily-cycles-end', {
    connection: redis,
  });

  // Upserting a repeatable job in the queue
  await myQueue.upsertJobScheduler(
    'operations-daily-cycles-end',
    {
      pattern: '0 30 23 * * *',
    },
    {
      name: 'operations-daily-cycles-end',
    },
  );

  return createMQWorkerWithListeners(
    'operations',
    'daily-cycles-end',
    dailyCheckCycles,
    redis,
    () => {
      console.log('Worker for queue operations-daily-cycles-end is ready');
    },
  );
};
