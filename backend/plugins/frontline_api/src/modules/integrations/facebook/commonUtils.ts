import { redis } from 'erxes-api-shared/utils/redis';
const CACHE_NAME = 'configs_erxes_fb_integrations';

export const resetConfigsCache = async () => {
  await redis.set(CACHE_NAME, '');
};
