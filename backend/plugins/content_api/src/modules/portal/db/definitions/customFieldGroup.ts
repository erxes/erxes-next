import { ICustomFieldGroupDocument } from '@/portal/@types/customFieldGroup';
import { Schema } from 'mongoose';

export const fieldGroupSchema = new Schema<ICustomFieldGroupDocument>(
  {
    clientPortalId: { type: String, required: true },
    label: { type: String, required: true },
    code: { type: String, unique: true },
    parentId: { type: String },
    order: { type: Number },
    customPostTypeIds: { type: [String] },

    enabledPageIds: { type: [String] },
    enabledCategoryIds: { type: [String] },
    type: { type: String, required: true, default: 'user' },
  },
  { timestamps: true },
);
