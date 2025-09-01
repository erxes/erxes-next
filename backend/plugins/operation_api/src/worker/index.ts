import { createMQWorkerWithListeners } from 'erxes-api-shared/utils';
import { dailyCheckCycles } from '~/worker/dailyCheckCycles';
import { scheduleCyclesJob } from '~/worker/scheduleCyclesJob';

export const initMQWorkers = async (redis: any) => {
  await createWorker(redis, 'cycles-job', dailyCheckCycles);
  await scheduleCyclesJob();
};

// Generic worker creator
const createWorker = async (redis: any, queueName: string, handler: any) => {
  return new Promise<void>((resolve) => {
    createMQWorkerWithListeners('operations', queueName, handler, redis, () => {
      resolve();
    });
  });
};
