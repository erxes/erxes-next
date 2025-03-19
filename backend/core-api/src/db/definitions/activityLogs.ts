import { Schema } from 'mongoose';
import { stringRandomId } from 'erxes-api-utils';
export const activityLogSchema = new Schema({
  _id: stringRandomId,
  contentId: { type: String, index: true },
  contentType: { type: String, index: true },
  action: { type: String, index: true },
  content: Schema.Types.Mixed,
  createdBy: { type: String, optional: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
