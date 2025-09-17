import { Schema } from 'mongoose';

export const configSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    contentId: { type: Schema.Types.ObjectId },
    createdBy: { type: String },
    updatedBy: { type: String },
    order: { type: Number },
  },
  {
    timestamps: true,
  },
);

configSchema.index({ contentId: 1, order: 1 });
