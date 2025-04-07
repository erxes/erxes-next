import { Worker } from 'bullmq';
import { ILog } from '../db/definitions/logs';
import { getEnv, getSubdomain } from 'erxes-api-utils';
import mongoose from 'mongoose';
import { connect } from 'backend/libs/utils/src/mongo/mongo-connection';
import {
  coreModelOrganizations,
  getSaasCoreConnection,
} from 'backend/libs/utils/src/saas/saas-mongo-connection';

import { createMQWorkerWithListeners } from 'erxes-api-utils';
import Redis from 'ioredis';
import { handleMongoChangeEvent } from './mongo';
import { generateModels } from '../db/connectionResolvers';

// let {
//   REDIS_HOST = 'localhost',
//   REDIS_PORT = 6379,
//   REDIS_PASSWORD = '',
//   DATABASE_NAME = 'erxes',
//   LOG_DATABASE_NAME = 'logs',
// } = process.env;

// // if (!LOG_DATABASE_NAME) {
// //   throw new Error("The LOG_DATABASE_NAME environment variable must be set");
// // }

// const connection = {
//   host: REDIS_HOST,
//   port: Number(REDIS_PORT),
//   password: REDIS_PASSWORD,
// };

type JobData = {
  source: 'graphql' | 'mongo';
  status: 'success' | 'failed';
  action?: string;
  payload: any;
  userId?: string;
  processId?: string;
};

// Function to initialize MongoDB databases

export const initMQWorkers = async (redis: Redis) => {
  console.info('Starting worker ...');
  const models = await generateModels('localhost');
  //   const dbs = await initializeDatabases(subdomain);
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
