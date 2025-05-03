import * as dotenv from 'dotenv';
import { redis } from './redis';
import { Queue } from 'bullmq';

dotenv.config();

const { NODE_ENV, LOAD_BALANCER_ADDRESS, MONGO_URL, LERNA_PACKAGE_NAME } =
  process.env;

const isDev = NODE_ENV === 'development';

export const keyForConfig = (name: string) => `service:config:${name}`;
const queue = new Queue('gateway-update-apollo-router', {
  connection: redis,
});

export const getPlugins = async (): Promise<string[]> => {
  const enabledServices = (await redis.smembers('enabled-services')) || '[]';

  return [...enabledServices];
};

export const addPlugin = async (serviceName: string): Promise<void> => {
  const isMember = await redis.sismember('enabled-services', serviceName);
  if (!isMember) {
    await queue.add('service-join', { serviceName });
  }

  try {
    await redis.sadd('enabled-services', serviceName);
    console.log(`Service ${serviceName} registered in Redis`);
  } catch (error) {
    console.error(`Failed to register service ${serviceName}:`, error);
  }
};

export const removePLugin = async (serviceName: string): Promise<void> => {
  queue.add('service-leave', { serviceName });
  redis.srem('enabled-services', serviceName);
};

type ServiceInfo = { address: string; config: any };
const serviceInfoCache: { [name in string]: Readonly<ServiceInfo> } = {};

export const getPlugin = async (
  name: string,
): Promise<Readonly<ServiceInfo>> => {
  if (serviceInfoCache[name]) {
    return serviceInfoCache[name];
  }

  const result: ServiceInfo = {
    address: (await redis.get(`service:${name}`)) || '',
    config: { meta: {} },
  };

  const configJson = await redis.get(keyForConfig(name));
  result.config = JSON.parse(configJson || '{}');

  Object.freeze(result);
  serviceInfoCache[name] = result;

  return result;
};

export const joinErxesGateway = async ({
  name,
  port,
  hasSubscriptions = false,
  importExportTypes,
  meta,
}: {
  name: string;
  port: number;
  hasSubscriptions?: boolean;
  importExportTypes?: any;
  meta?: any;
}) => {
  await redis.set(
    keyForConfig(name),

    JSON.stringify({
      dbConnectionString: MONGO_URL,
      hasSubscriptions,
      importExportTypes,
      meta,
    }),
  );

  const address = LOAD_BALANCER_ADDRESS || `http://localhost:${port}`;

  await redis.set(`service:${name}`, address);

  await addPlugin(name);

  console.log(`$service:${name} joined with ${address}`);
};

export const leaveErxesGateway = async (name: string, port: number) => {
  await removePLugin(name);

  console.log(`$service:${name} left ${port}`);
};

export const isEnabled = async (name: string) => {
  if (name === 'core') return true;

  const enabledServices = await getPlugins();

  return enabledServices.includes(name);
};

const pluginAddressCache = {} as any;

export const getPluginAddress = async (name: string) => {
  if (!pluginAddressCache[name]) {
    pluginAddressCache[name] = await redis.get(`service:${name}`);
  }
  return pluginAddressCache[name];
};

function getNonFunctionProps<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (typeof obj[key] !== 'function') {
      result[key] = obj[key];
    }
  }

  return result;
}

export const initializePluginConfig = async <TConfig extends object>(
  pluginName: string,
  propertyName: string,
  config: TConfig,
) => {
  const pluginConfig = await redis.get(keyForConfig(pluginName));
  const configJSON = JSON.parse(pluginConfig || '{}');

  await redis.set(
    keyForConfig(pluginName),

    JSON.stringify({
      ...configJSON,
      meta: {
        ...(configJSON?.meta || {}),
        [propertyName]: getNonFunctionProps<TConfig>(config),
      },
    }),
  );
};
