import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const documentSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdUserId: { type: String },
    contentType: { type: String },
    subType: { type: String, optional: true },
    name: { type: String },
    content: { type: String },
    replacer: { type: String },
    code: { type: String },
  },
  {
    timestamps: true,
  },
);

documentSchema.index({ code: 1 }, { unique: true });
