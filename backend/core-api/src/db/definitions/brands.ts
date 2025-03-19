import { schemaWrapper, stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';
export const brandEmailConfigSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['simple', 'custom'],
      label: 'Type',
    },
    template: { type: String, label: 'Template', optional: true },
    email: {
      type: String,
      label: 'Email',
      optional: true,
    },
  },
  { _id: false },
);

export const brandSchema = schemaWrapper(
  new Schema({
    _id: stringRandomId,
    code: { type: String, label: 'Code' },
    name: { type: String, label: 'Name' },
    description: {
      type: String,
      optional: true,
      label: 'Description',
    },
    userId: { type: String, label: 'Created by' },
    createdAt: { type: Date, label: 'Created at' },
    emailConfig: {
      type: brandEmailConfigSchema,
      label: 'Email config',
    },
  }),
);
