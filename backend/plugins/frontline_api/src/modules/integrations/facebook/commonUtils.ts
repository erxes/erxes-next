import { redis } from 'erxes-api-shared/utils/redis';
import {debugBase} from '@/integrations/facebook/debuggers'
const CACHE_NAME = 'configs_erxes_fb_integrations';

export const resetConfigsCache = async () => {
  await redis.set(CACHE_NAME, '');
};

export const getEnv = ({
  name,
  subdomain,
  defaultValue
}: {
  name: string;
  subdomain?: string;
  defaultValue?: string;
}): string => {
  let value = process.env[name];

  if (!value && typeof defaultValue !== 'undefined') {
    return defaultValue;
  }

  if (value && subdomain) {
    value = value.replace('<subdomain>', subdomain);
  }

  if (!value) {
    debugBase(`Missing environment variable configuration for ${name}`);
  }

  return value || '';
};