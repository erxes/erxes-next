import {
  createMQWorkerWithListeners,
  sendWorkerMessage,
} from 'erxes-api-shared/utils';
import Redis from 'ioredis';
import { generateModels } from '../db/connectionResolvers';

// type JobData = {
//   source: 'graphql' | 'mongo';
//   status: 'success' | 'failed';
//   action?: string;
//   payload: any;
//   userId?: string;
//   processId?: string;
// };

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
          const { subdomain, data } = job?.data ?? {};
          try {
            console.log({ data });

            const result = await sendWorkerMessage({
              serviceName: 'core',
              queueName: 'automations',
              jobName: 'receiveActions',
              subdomain,
              data,
              defaultValue: null,
            });

            console.log({ result });
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
