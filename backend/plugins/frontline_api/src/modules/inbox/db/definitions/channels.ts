import { Schema } from 'mongoose';

export const channelSchema = new Schema({
  createdAt: { type: Date, label: 'Created at' },
  name: { type: String, label: 'Name' },
  description: {
    type: String,
    optional: true,
    label: 'Description',
  },
  integrationIds: { type: [String], label: 'Integrations' },
  memberIds: { type: [String], label: 'Members' },
  userId: { type: String, label: 'Created by' },
  conversationCount: {
    type: Number,
    default: 0,
    label: 'Conversation count',
  },
  openConversationCount: {
    type: Number,
    default: 0,
    label: 'Open conversation count',
  },
});
