import mongoose from 'mongoose';
import { getEnv, getSubdomain } from '../utils';
import { connect } from './mongo-connection';
import {
  coreModelOrganizations,
  getSaasCoreConnection,
} from '../saas/saas-mongo-connection';
import { redis } from '../redis';
import { sendWorkerQueue } from '../mq-worker';
import { isEnabled } from '../service-discovery';
const activeStreams = new Map<string, any>();

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

export const startChangeStreams = (
  models: Record<string, mongoose.Model<any>>,
  subdomain: string,
) => {
  for (const [modelName, model] of Object.entries(models)) {
    // Skip if already watching this model
    if (activeStreams.has(modelName)) continue;

    const changeStream = model.watch([], {
      fullDocument: 'updateLookup',
    });

    // Store reference
    activeStreams.set(modelName, changeStream);
    const contentType = (model.schema.statics as any)._contentType;

    changeStream.on('change', (change) => {
      // Send to your worker queue
      sendWorkerQueue('logs', 'put_log').add('put_log', {
        subdomain,
        source: 'mongo',
        contentType,
        payload: change,
      });
    });

    changeStream.on('error', (err) => {
      console.error(`Change stream error for ${modelName}:`, err);
      activeStreams.delete(modelName);
    });

    changeStream.on('close', () => {
      console.log(`Change stream closed for ${modelName}`);
      activeStreams.delete(modelName);
    });
  }
};
