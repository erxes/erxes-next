import Redis from 'ioredis';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

export const redis = new Redis({
  host: 'redis',
  port: parseInt(REDIS_PORT || '6379', 10),
  password: REDIS_PASSWORD,
  connectTimeout: 20_000,
  maxRetriesPerRequest: null,
  reconnectOnError: (error) => {
    const targetErrors = [/READONLY/, /ETIMEDOUT/];
    if (targetErrors.some((targetError) => targetError.test(error.message))) {
      return 2;
    } else {
      return false;
    }
  },
});
