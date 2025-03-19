import { stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';
export const emailTemplateSchema = new Schema({
  _id: stringRandomId,
  name: { type: String, label: 'Name' },
  status: { type: String, label: 'Status' },
  content: { type: String, optional: true, label: 'Content' },
  createdAt: {
    type: Date,
    label: 'Created at',
  },
  createdBy: { type: String, label: 'Created by' },
  modifiedAt: { type: Date, label: 'Modified at' },
});
