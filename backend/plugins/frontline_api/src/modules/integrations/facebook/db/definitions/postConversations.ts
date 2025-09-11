import { Schema } from 'mongoose';
export const postConversationSchema = new Schema({
  erxesApiId: String,
  postId: { type: String, index: true },
  timestamp: Date,
  senderId: String,
  recipientId: String,
  integrationId: String,
  content: String,
  customerId: { type: String, optional: true },
  permalink_url: String,
  attachments: [String],
});
