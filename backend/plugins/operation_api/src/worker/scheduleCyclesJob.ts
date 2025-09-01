import { Queue } from 'bullmq';
import { redis } from 'erxes-api-shared/utils';

const JOB_ID = 'daily-cycles-end';
const QUEUE_NAME = 'operations-cycles-job';
const CRON_PATTERN = '30 23 * * *';

let queueInstance: Queue | null = null;

const getQueue = () => {
  if (!queueInstance) {
    queueInstance = new Queue(QUEUE_NAME, { connection: redis });
  }
  return queueInstance;
};

export const scheduleCyclesJob = async () => {
  const queue = getQueue();

  try {
    // Remove previous repeatable jobs
    const repeatableJobs = await queue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.id === JOB_ID) {
        await queue.removeRepeatableByKey(job.key);
      }
    }

    // Add the new repeatable job
    await queue.add(
      'endCycle',
      { scheduledAt: new Date().toISOString() },
      {
        jobId: JOB_ID,
        repeat: {
          pattern: CRON_PATTERN,
        },
        removeOnComplete: 5,
        removeOnFail: 10,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );

    console.log(`Successfully scheduled ${JOB_ID} job`);
  } catch (error) {
    console.error(`Failed to schedule ${JOB_ID} job:`, error);
    throw error;
  }
};
