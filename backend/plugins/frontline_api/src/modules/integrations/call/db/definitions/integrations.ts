import { Schema } from 'mongoose';

export const integrationSchema = new Schema({
  inboxId: { type: String, label: 'inbox id' },
  wsServer: { type: String, label: 'web socket server' },
  phone: { type: String, label: 'phone number', unique: true },
  operators: { type: Object, label: 'Operator maps' },
  token: { type: String, label: 'token' },
  queues: { type: [String], label: 'queues' },
  queueNames: { type: [String], label: 'queue names' },
  srcTrunk: { type: String, label: 'inbound trunk name' },
  dstTrunk: { type: String, label: 'outbound trunk name' },
});

integrationSchema.index({ wsServer: 1, queues: 1 }, { unique: true });
integrationSchema.index({ srcTrunk: 1 }, { unique: true });
integrationSchema.index({ dstTrunk: 1 }, { unique: true });
