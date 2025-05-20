import {
  createMQWorkerWithListeners,
  sendWorkerQueue,
} from 'erxes-api-shared/utils';
import Redis from 'ioredis';
import { generateModels } from '../db/connectionResolvers';
import { handleMongoChangeEvent } from './mongo';

type JobData = {
  subdomain: string;
  source: 'graphql' | 'mongo';
  status: 'success' | 'failed';
  action?: string;
  contentType?: string;
  payload: any;
  userId?: string;
  processId?: string;
};

export const initMQWorkers = async (redis: any) => {
  console.info('Starting worker ...');

  console.info('Initialized databases');
  return new Promise<void>((resolve, reject) => {
    try {
      createMQWorkerWithListeners(
        'logs',
        'put_log',
        async ({ id, data }) => {
          const {
            subdomain,
            source,
            payload,
            contentType,
            userId,
            action,
            status,
            processId,
          } = (data ?? {}) as JobData;

          console.log({ source, subdomain, contentType });

          try {
            const models = await generateModels(subdomain);
            switch (source) {
              case 'mongo':
                await handleMongoChangeEvent(models.Logs, payload, contentType);
                sendWorkerQueue('automations', 'trigger').add('trigger', {
                  subdomain,
                  data: payload?.fullDocument,
                });
                break;
              default:
                await models.Logs.insertOne({
                  source,
                  action,
                  payload,
                  createdAt: new Date(),
                  userId,
                  status,
                  processId,
                });
                break;
            }
          } catch (error: any) {
            console.error(`Error processing job ${id}: ${error.message}`);
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
