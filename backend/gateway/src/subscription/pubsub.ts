import * as dotenv from 'dotenv';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

dotenv.config();


const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const pubsub = new RedisPubSub({
  connectionListener: (error) => {
    if (error) {
      console.error(error);
    }
  },
  publisher: new Redis({
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT || '6379'),
    password: REDIS_PASSWORD,
  }),
  subscriber: new Redis({
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT || '6379'),
    password: REDIS_PASSWORD,
  }),
} as any);

export default pubsub;
