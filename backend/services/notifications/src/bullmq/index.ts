import { createMQWorkerWithListeners } from 'erxes-api-shared/utils';
import { handleCreateNotification } from '@/utils/handlers/notificationHandler';
import { debugInfo } from '@/utils/debugger';

export const initMQWorkers = async (redis: any) => {
  debugInfo('Starting notification workers...');

  await createWorker(redis, 'notifications', handleCreateNotification);

  debugInfo('Notification workers initialized');
};

// Generic worker creator
const createWorker = async (redis: any, queueName: string, handler: any) => {
  return new Promise<void>((resolve) => {
    createMQWorkerWithListeners(
      'notifications',
      queueName,
      handler,
      redis,
      () => {
        resolve();
      },
    );
  });
};

