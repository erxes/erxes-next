import { ICustomPostTypeDocument } from '@/portal/@types/customPostType';
import { Schema } from 'mongoose';

export const customPostTypeSchema = new Schema<ICustomPostTypeDocument>(
  {
    clientPortalId: { type: String, required: true },

    label: { type: String, required: true },
    pluralLabel: { type: String, required: true },
    code: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true },
);

customPostTypeSchema.index({ name: 1, clientPortalId: 1 }, { unique: true });
