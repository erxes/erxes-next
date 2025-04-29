import * as dotenv from 'dotenv';
import { redis } from './redis';

dotenv.config();

const { NODE_ENV, LOAD_BALANCER_ADDRESS, MONGO_URL } = process.env;

const isDev = NODE_ENV === 'development';

const keyForConfig = (name: string) => `service:config:${name}`;

export const getPlugins = async (): Promise<string[]> => {
  const enabledServices =
    process.env.ENABLED_PLUGINS?.split(',').map((plugin) => `${plugin}`) ||
    [];

  return ['core', ...enabledServices];
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

  const address =
    LOAD_BALANCER_ADDRESS ||
    `http://${isDev ? 'localhost' : `plugin-${name}-api`}:${port}`;

  await redis.set(`service:${name}`, address);

  console.log(`$service:${name} joined with ${address}`);
};

export const leaveErxesGateway = async (name: string, port: number) => {
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
