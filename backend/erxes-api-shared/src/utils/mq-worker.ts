import { Queue, QueueEvents, Worker } from 'bullmq';
import type { Redis } from 'ioredis';
import type { Job, Worker as WorkerType } from 'bullmq';
import { redis } from './redis';

export const createMQWorkerWithListeners = (
  service: string,
  queueName: string,
  processor: (job: Job) => Promise<any>,
  redis: Redis,
  onReady: () => void,
): WorkerType => {
  const worker = new Worker(`${service}-${queueName}`, processor, {
    connection: redis,
  });

  // Default event listeners
  worker.on('completed', (job) => {
    console.log(
      `[Worker] Job ${job.id} in queue '${service}-${queueName}' completed successfully`,
    );
  });

  worker.on('failed', (job, err) => {
    console.error(
      `[Worker] Job ${job?.id} in queue '${service}-${queueName}' failed with error: ${err.message}`,
    );
  });

  worker.on('error', (err) => {
    console.error(
      `[Worker] Error in worker for queue '${service}-${queueName}': ${err.message}`,
    );
  });

  worker.on('ready', () => {
    console.log(`[Worker] Worker for queue '${service}-${queueName}' is ready`);
    onReady();
  });

  return worker;
};

export const sendWorkerQueue = (serviceName: string, queueName: string) =>
  new Queue(`${serviceName}-${queueName}`, {
    connection: redis,
  });

export const sendWorkerMessage = async ({
  serviceName,
  queueName,
  jobName,
  subdomain,
  data,
  defaultValue,
}: {
  serviceName: string;
  queueName: string;
  jobName: string;
  subdomain: string;
  data: any;
  defaultValue?: any;
}) => {
  const queueKey = `${serviceName}-${queueName}`;

  const queue = new Queue(queueKey, {
    connection: redis,
  });

  const queueEvents = new QueueEvents(queueKey, {
    connection: redis,
  });

  await queueEvents.waitUntilReady(); // Ensures the events are ready before waiting for job completion

  const job = await queue.add(jobName, { subdomain, data });

  const result = await job.waitUntilFinished(queueEvents);
  return result || defaultValue;
};
