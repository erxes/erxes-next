import { Schema } from 'mongoose';
export const attachmentSchema = new Schema({
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  type: { type: String, required: true },
  size: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isFinite,
      message: 'Size must be a valid number'
    }
  },
  attachmentId: { type: String, required: true }
}, { _id: false });

const emailSchema = new Schema(
  {
    name: { type: String },
    address: { type: String },
  },
  { _id: false }
);

export const messageSchema = new Schema({
  inboxIntegrationId: { type: String, required: true },
  inboxConversationId: { type: String, required: true },
  subject: { type: String, required: true },
  messageId: { type: String, required: true, unique: true },
  inReplyTo: { type: String },
  references: [String],
  body: { type: String, required: true },
  to: { type: [emailSchema], required: true },
  cc: [emailSchema],
  bcc: [emailSchema],
  from: { type: [emailSchema], required: true },
  attachments: [attachmentSchema],
  createdAt: { type: Date, index: true, default: Date.now },
  type: {
    type: String,
    enum: ['SENT', 'INBOX'],
    required: true
  }
});