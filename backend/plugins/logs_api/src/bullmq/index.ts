import {
  createMQWorkerWithListeners,
  sendWorkerQueue,
} from 'erxes-api-shared/utils';
import Redis from 'ioredis';
import { generateModels } from '../db/connectionResolvers';
import { handleMongoChangeEvent } from './mongo';
import { handleAfterProcess } from './afterProccess';
import { IJobData } from '~/types';
import { ILogDocument } from '~/db/definitions/logs';

const plugins = [
  {
    name: 'frontline',
    configs: [
      {
        type: 'afterMutation',
        mutationNames: ['userEdit'],
      },
      {
        type: 'updateDocument',
        contentTypes: ['core:user', 'frontline:ticket'],
        when: {
          fieldsUpdated: ['assignedUserIds', 'branchIds'],
        },
      },
      {
        type: 'createDocument',
        contentTypes: ['core:user'],
        when: {
          fieldsWith: ['brandIds'],
        },
      },
      {
        type: 'afteAPIRequest',
        paths: ['/callback/khanbank'],
      },
      {
        type: 'afteAuth',
        types: ['login'],
      },
    ],
  },
];

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
          } = (data ?? {}) as IJobData;

          try {
            const models = await generateModels(subdomain);

            let result: ILogDocument;

            if (source === 'mongo') {
              result = await handleMongoChangeEvent(
                models.Logs,
                payload,
                contentType,
              );
              sendWorkerQueue('automations', 'trigger').add('trigger', {
                subdomain,
                data: payload?.fullDocument,
              });
            } else {
              const logDoc = {
                source,
                action,
                payload,
                createdAt: new Date(),
                userId,
                status,
                processId,
              };
              result = await models.Logs.insertOne(logDoc);
            }

            if (status === 'success') {
              handleAfterProcess(subdomain, {
                source,
                action: result.action || action,
                contentType,
                payload: { ...result?.payload, userId },
              });
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
