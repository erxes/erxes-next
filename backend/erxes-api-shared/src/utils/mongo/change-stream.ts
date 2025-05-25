import mongoose from 'mongoose';
import { sendWorkerQueue } from '../mq-worker';
import { redis } from '../redis';
import { getEnv } from '../utils';
const activeStreams = new Map<string, any>();

// Add a cleanup function to properly close all streams when needed
export const cleanupChangeStreams = () => {
  activeStreams.forEach((stream, modelName) => {
    console.log(`Closing change stream for model: ${modelName}`);
    stream.close();
  });
  activeStreams.clear();
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
