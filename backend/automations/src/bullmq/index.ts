import { createMQWorkerWithListeners } from 'erxes-api-shared/utils';
import Redis from 'ioredis';
import { generateModels } from '../db/connectionResolvers';

type JobData = {
  source: 'graphql' | 'mongo';
  status: 'success' | 'failed';
  action?: string;
  payload: any;
  userId?: string;
  processId?: string;
};

export const initMQWorkers = async (redis: Redis) => {
  console.info('Starting worker ...');
  const models = await generateModels('localhost');
  console.info('Initialized databases');
  return new Promise<void>((resolve, reject) => {
    try {
      createMQWorkerWithListeners(
        'automations',
        'trigger',
        async (job) => {
          const data = (job?.data ?? {}) as JobData;
          try {
            console.log({ data });
          } catch (error: any) {
            console.error(`Error processing job ${job.id}: ${error.message}`);
            throw error;
          }
        },
        redis,
        () => {
          resolve();
        },
      );
    } catch (error) {
      reject(error);
    }
  });
};
