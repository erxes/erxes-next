import { Schema } from 'mongoose';

export const operatorSchema = new Schema({
  userId: { type: String, label: 'user id', unique: true },
  extension: { type: String, label: 'Operator extension' },
  status: {
    type: String,
    label: 'Operator extension',
    enum: ['unAvailable', 'idle', 'pause', 'unpause'],
    default: 'unAvailable',
  },
});

export const queueStatisticsSchema = new Schema({
  queuechairman: { type: String, required: true },
  integrationId: { type: String, required: true },
  queue: { type: Number, required: true },
  totalCalls: { type: Number, default: 0 },
  answeredCalls: { type: Number, default: 0 },
  answeredRate: { type: Number, default: 0 },
  abandonedCalls: { type: Number, default: 0 },
  avgWait: { type: Number, default: 0 },
  avgTalk: { type: Number, default: 0 },
  vqTotalCalls: { type: Number, default: 0 },
  slaRate: { type: Number, default: 0 },
  vqSlaRate: { type: Number, default: 0 },
  transferOutCalls: { type: Number, default: 0 },
  transferOutRate: { type: Number, default: 0 },
  abandonedRate: { type: Number, default: 0 },
});
