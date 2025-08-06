import { Queue } from 'bullmq';
import { redis } from 'erxes-api-shared/utils';

const JOB_ID = 'daily-archive-expired';
const QUEUE_NAME = 'notifications-dailyJob';
const CRON_PATTERN = '0 3 * * *'; // 3 AM UTC daily

// Consider connection pooling/reuse
let queueInstance: Queue | null = null;

const getQueue = () => {
  if (!queueInstance) {
    queueInstance = new Queue(QUEUE_NAME, { connection: redis });
  }
  return queueInstance;
};
export const scheduleNotificationJobs = async () => {
  const queue = getQueue();

  try {
    // 1. Clean up existing repeatable jobs
    const existingJobs = await queue.getRepeatableJobs();

    await Promise.all(
      existingJobs
        .filter((job) => job.id === JOB_ID)
        .map((job) => queue.removeRepeatableByKey(job.key)),
    );

    // 2. Add the new scheduled job
    await queue.add(
      'archiveExpiredNotifications',
      {
        scheduledAt: new Date().toISOString(),
      },
      {
        jobId: JOB_ID,
        repeat: {
          pattern: CRON_PATTERN,
          tz: 'UTC', // Explicit timezone
        },
        removeOnComplete: 5, // Keep last 5 successful runs
        removeOnFail: 10, // Keep last 10 failed runs
        attempts: 3, // Retry failed jobs
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );

    console.log(`Successfully scheduled ${JOB_ID} job`);
  } catch (error) {
    console.error(`Failed to schedule ${JOB_ID} job:`, error);
    throw error;
  } finally {
    await queue.close(); // Clean up connection
  }
};
