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

let {
  REDIS_HOST = 'localhost',
  REDIS_PORT = 6379,
  REDIS_PASSWORD = '',
  DATABASE_NAME = 'erxes',
  LOG_DATABASE_NAME = 'logs',
} = process.env;

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
const initializeDatabases = async (hostnameOrSubdomain: string) => {
  const VERSION = getEnv({
    name: 'VERSION',
    defaultValue: 'os',
  }) as 'saas' | 'os';

  const client = await connect();

  if (VERSION === 'saas') {
    let subdomain: string = hostnameOrSubdomain;

    if (!subdomain) {
      throw new Error(`Subdomain is \`${subdomain}\``);
    }

    // means hostname
    if (subdomain.includes('.')) {
      subdomain = getSubdomain(hostnameOrSubdomain);
    }

    await getSaasCoreConnection();

    const organization = await coreModelOrganizations.findOne({ subdomain });
    if (!organization) {
      throw new Error(
        `Organization with subdomain = ${subdomain} is not found`,
      );
    }

    const DB_NAME = getEnv({ name: 'DB_NAME' });
    const GE_MONGO_URL = (DB_NAME || 'erxes_<organizationId>').replace(
      '<organizationId>',
      organization._id,
    );
    DATABASE_NAME = GE_MONGO_URL;
    LOG_DATABASE_NAME = `${GE_MONGO_URL}_logs`;
  }

  return {
    logs: client.useDb(LOG_DATABASE_NAME).collection<ILog>('logs'),
    core: client.useDb(DATABASE_NAME),
  };
};

export const initMQWorkers = (redis: Redis) => {
  console.info('Starting worker ...');

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
                //   await handleMongoChangeEvent(dbs, payload);
                break;
              default:
                // await dbs.logs.insertOne({
                //   source,
                //   action,
                //   payload,
                //   createdAt: new Date(),
                //   userId,
                //   status,
                // });
                break;
            }
          } catch (error: any) {
            console.error(`Error processing job ${job.id}: ${error.message}`);
            throw error;
          }
        },
        redis,
        () => {},
      );
    } catch (error) {
      reject(error);
    }
  });
};
