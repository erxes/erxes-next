import { createMQWorkerWithListeners } from 'erxes-api-shared/utils';
import Redis from 'ioredis';
import { generateModels } from '~/connectionResolver';
import {
  checkWaitingResponseAction,
  doWaitingResponseAction,
} from '~/utils/actions/wait';
import { receiveTrigger } from '~/utils/utils';

// type JobData = {
//   source: 'graphql' | 'mongo';
//   status: 'success' | 'failed';
//   action?: string;
//   payload: any;
//   userId?: string;
//   processId?: string;
// };

export const initMQWorkers = async (redis: any) => {
  console.info('Starting worker ...');
  console.info('Initialized databases');
  return new Promise<void>((resolve, reject) => {
    try {
      createMQWorkerWithListeners(
        'automations',
        'trigger',
        async (job) => {
          const { subdomain, data } = job?.data ?? {};
          const models = await generateModels(subdomain);

          console.info(
            `Recieved data from:${JSON.stringify({ subdomain, data })}`,
          );

          const { type, actionType, targets, executionId } = data;
          try {
            const waitingExecution = await checkWaitingResponseAction(
              models,
              type,
              actionType,
              targets,
              executionId,
            );

            if (waitingExecution) {
              await doWaitingResponseAction(
                models,
                subdomain,
                data,
                waitingExecution,
              );
              return;
            }

            await receiveTrigger({ models, subdomain, type, targets });
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
