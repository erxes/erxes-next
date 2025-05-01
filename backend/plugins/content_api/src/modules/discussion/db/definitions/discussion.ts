import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';
import { Schema } from 'mongoose';

export const voteSchema = new Schema({
  _id: mongooseStringRandomId,
  createdAt: { type: Date },
  createdUserId: { type: String },

  discussionId: { type: String },
  isUp: { type: Boolean },
});

export const discussionSchema = new Schema({
  _id: mongooseStringRandomId,
  createdAt: { type: Date },
  createdUserId: { type: String },

  title: { type: String },
  content: { type: String },
  attachments: { type: [Object] },
  tags: { type: [String] },
  questions: { type: [String] },
});
