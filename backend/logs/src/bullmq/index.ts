import { createMQWorkerWithListeners } from 'erxes-api-shared/utils';
import Redis from 'ioredis';
import { generateModels } from '../db/connectionResolvers';
import { handleMongoChangeEvent } from './mongo';

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
        'logs',
        'put_log',
        async (job) => {
          const { source, payload, userId, action, status } = (job?.data ??
            {}) as JobData;
          try {
            switch (source) {
              case 'mongo':
                await handleMongoChangeEvent(models.Logs, payload);
                break;
              default:
                await models.Logs.insertOne({
                  source,
                  action,
                  payload,
                  createdAt: new Date(),
                  userId,
                  status,
                });
                break;
            }
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
