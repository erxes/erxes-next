import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const checklistSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    contentType: {
      type: String,
      label: 'Content type',
      index: true,
      default: 'task',
    },
    order: { type: Number },
    contentTypeId: {
      type: String,
      label: 'Content type item',
      index: true,
    },
    title: { type: String, label: 'Title' },
    createdUserId: { type: String, label: 'Created by' },
  },
  {
    timestamps: true,
  },
);

export const checklistItemSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    checklistId: { type: String, label: 'Check list', index: true },
    content: { type: String, label: 'Content' },
    isChecked: { type: Boolean, label: 'Is checked' },
    createdDate: { type: Date, label: 'Created at' },
    order: { type: Number },
  },
  {
    timestamps: true,
  },
);
