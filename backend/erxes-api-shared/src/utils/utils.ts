import mongoose, { Collection } from 'mongoose';
import { connect } from './mongo/mongo-connection';
import {
  coreModelOrganizations,
  getSaasCoreConnection,
} from './saas/saas-mongo-connection';

import { redis } from './redis';
import { sendWorkerQueue } from './mq-worker';
import { LOG_STATUSES } from './constants';
import { isEnabled } from './service-discovery';

export const getEnv = ({
  name,
  defaultValue,
  subdomain,
}: {
  name: string;
  defaultValue?: string;
  subdomain?: string;
}): string => {
  let value = process.env[name] || '';

  if (!value && typeof defaultValue !== 'undefined') {
    return defaultValue;
  }

  if (subdomain) {
    value = value.replace('<subdomain>', subdomain);
  }

  return value || '';
};

export const getSubdomain = (req: any): string => {
  const hostname =
    req.headers['nginx-hostname'] || req.headers.hostname || req.hostname;
  const subdomain = hostname.replace(/(^\w+:|^)\/\//, '').split('.')[0];
  return subdomain;
};

export const connectionOptions: mongoose.ConnectOptions = {
  family: 4,
};

export const cleanActiveChangeStream = async () => {
  const REDIS_KEY_PREFIX = getEnv({
    name: 'REDIS_KEY_PREFIX',
    defaultValue: 'changeStreamActive',
  });
  const keys = await redis.keys(`${REDIS_KEY_PREFIX}:*`);

  // Check if keys is an array and contains valid keys
  if (keys && keys.length > 0) {
    // Make sure all keys are strings
    const validKeys = keys.filter(
      (key) => typeof key === 'string' && key.length > 0,
    );

    if (validKeys.length > 0) {
      await redis.del(...validKeys);
    }
  }
};

const startChangeStream = async (models: mongoose.Models) => {
  const REDIS_KEY_PREFIX = getEnv({
    name: 'REDIS_KEY_PREFIX',
    defaultValue: 'changeStreamActive',
  });
  for (const modelKey of Object.keys(models)) {
    const redisKey = `${REDIS_KEY_PREFIX}:${modelKey}`;

    const isActive = await redis.get(redisKey);
    if (isActive) {
      continue;
    }

    const model = models[modelKey];

    console.log(`Setting up change stream for ${modelKey}...`);

    const changeStream = model.watch([], {
      fullDocument: 'updateLookup',
    });

    await redis.set(redisKey, 'active');
    changeStream.on('change', (change) => {
      sendWorkerQueue('logs', 'put_log').add('put_log', {
        source: 'mongo',
        payload: change,
      });
    });
  }
};

const initializeModels = async <IModels>(
  connection: mongoose.Connection,
  loadClasses: (
    db: mongoose.Connection,
    subdomain: string,
  ) => IModels | Promise<IModels>,
  subdomain: string,
  ignoreChangeStream?: boolean,
) => {
  const models = await loadClasses(connection, subdomain);
  if (!ignoreChangeStream && (await isEnabled('logs'))) {
    startChangeStream(models as any);
  }

  return models;
};

export const createGenerateModels = <IModels>(
  loadClasses: (
    db: mongoose.Connection,
    subdomain: string,
  ) => IModels | Promise<IModels>,
  ignoreChangeStream?: boolean,
): ((hostnameOrSubdomain: string) => Promise<IModels>) => {
  const VERSION = getEnv({ name: 'VERSION', defaultValue: 'os' });

  connect();

  if (VERSION && VERSION !== 'saas') {
    let models: IModels | null = null;
    return async function genereteModels(
      hostnameOrSubdomain: string,
    ): Promise<IModels> {
      if (models) {
        return models;
      }

      return initializeModels(
        mongoose.connection,
        loadClasses,
        hostnameOrSubdomain,
        ignoreChangeStream,
      );
    };
  } else {
    return async function genereteModels(
      hostnameOrSubdomain = '',
    ): Promise<IModels> {
      let subdomain: string = hostnameOrSubdomain;

      if (!subdomain) {
        throw new Error(`Subdomain is \`${subdomain}\``);
      }

      // means hostname
      if (subdomain && subdomain.includes('.')) {
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

      const tenantCon = mongoose.connection.useDb(GE_MONGO_URL, {
        // so that conn.model method can use cached connection
        useCache: true,
        noListener: true,
      });

      return initializeModels(
        tenantCon,
        loadClasses,
        subdomain,
        ignoreChangeStream,
      );
    };
  }
};

export const authCookieOptions = (options: any = {}) => {
  const NODE_ENV = getEnv({ name: 'NODE_ENV' });
  const maxAge = options.expires || 14 * 24 * 60 * 60 * 1000;

  const secure = !['test', 'development'].includes(NODE_ENV);

  if (!secure && options.sameSite) {
    delete options.sameSite;
  }

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + maxAge),
    maxAge,
    secure,
    ...options,
  };

  return cookieOptions;
};

export const paginate = (
  collection: any,
  params: {
    ids?: string[];
    page?: number;
    perPage?: number;
    excludeIds?: boolean;
  },
) => {
  const { page = 1, perPage = 20, ids, excludeIds } = params || { ids: null };

  const _page = Number(page || '1');
  const _limit = Number(perPage || '20');

  if (ids && ids.length > 0) {
    return excludeIds ? collection.limit(_limit) : collection;
  }

  return collection.limit(_limit).skip((_page - 1) * _limit);
};

export const validSearchText = (values: string[]) => {
  const value = values.join(' ');

  if (value.length < 512) {
    return value;
  }

  return value.substring(0, 511);
};

export const getCoreDomain = () => {
  const NODE_ENV = process.env.NODE_ENV;

  return NODE_ENV === 'production'
    ? 'https://erxes.io'
    : 'http://localhost:3500';
};

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const checkCodeDuplication = async (collection: any, code: string) => {
  if (code.includes('/')) {
    throw new Error('The "/" character is not allowed in the code');
  }

  const category = await collection.findOne({
    code,
  });

  if (category) {
    throw new Error('Code must be unique');
  }
};
