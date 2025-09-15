import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const templateSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, required: true, label: 'Name' },
    description: { type: String, optional: true, label: 'Description' },
    content: { type: String, required: false, label: 'Content' },
    contentType: {
      type: String,
      required: false,
      label: 'Content Type',
    }!,
    relatedType: { type: String, label: 'Related Type' },
    categoryIds: { type: [String], label: 'Category ids' },
    createdBy: { type: String, label: 'Created by' },
    createdDate: {
      type: Date,
      label: 'Created at',
    },
    updadtedAt: { type: Date, label: 'Updated by' },
    updatedBy: { type: String, label: 'Updated by' },
  },

  {
    timestamps: true,
  },
);
export const CategorySchema = new Schema({
  _id: mongooseStringRandomId,
  name: { type: String, required: true, label: 'Name' },
  parentId: { type: String, label: 'Parent id' },
  order: {
    type: String,
    required: true,
    label: 'Order',
    code: { type: String, required: true, label: 'Code' },
    contentType: { type: String, require: false, label: 'Content type' },
    createdAt: { type: Date, label: 'Created at' },
    createdBy: {
      type: String,

      label: 'Created by',
    },
    updadtedAt: { type: String, label: 'Updated by' },
    updatedBy: { type: Date, label: 'Updated by' },
  },
});

export const ContentSchema = new Schema({
  contentType: { type: String, required: true, label: 'Content type' },
  content: { type: [String], label: 'Content' },
});
