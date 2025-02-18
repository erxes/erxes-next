import type { Redis } from 'ioredis';
import { createMQWorkerWithListeners } from 'erxes-api-utils';
import { updateApolloRouter } from '../../apollo-router';

export const initMQWorkers = (redis: Redis) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Initialize the queue and worker
      createMQWorkerWithListeners(
        'gateway',
        'update-apollo-router',
        async () => {
          updateApolloRouter();
          return { result: 'success' };
        },
        redis,
        () => {
          // Resolve the promise when the worker is ready
          resolve();
        },
      );
    } catch (error) {
      // Reject the promise if there's an error during initialization
      reject(error);
    }
  });
};
