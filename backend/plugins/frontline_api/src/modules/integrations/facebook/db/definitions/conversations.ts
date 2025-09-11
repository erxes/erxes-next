import { Schema } from 'mongoose';

export const conversationSchema = new Schema({
  erxesApiId: String,
  timestamp: Date,
  senderId: { type: String, index: true },
  recipientId: { type: String, index: true },
  integrationId: String,
  content: String,
  isBot: Boolean,
  botId: { type: String, optional: true },
});

conversationSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });
