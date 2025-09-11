import { IMenuItemDocument } from '@/portal/@types/menu';
import { Schema } from 'mongoose';

export const menuItemSchema = new Schema<IMenuItemDocument>(
  {
    clientPortalId: { type: String, required: true },
    label: { type: String, required: true },
    contentType: { type: String },
    contentTypeID: { type: String },
    kind: { type: String, required: true },
    icon: { type: String },
    url: { type: String },
    parentId: { type: String },
    order: { type: Number, required: true },
    target: { type: String, default: '_self' },
  },
  { timestamps: true },
);
