import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { CLASS_LEVEL_TYPES } from '../../constants';

export const classSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, required: true, label: 'Name' },
    description: { type: String, required: true, label: 'Description' },
    location: { type: String, required: true, label: 'Location' },
    level: {
      type: String,
      enum: CLASS_LEVEL_TYPES.ALL,
      default: CLASS_LEVEL_TYPES.Beginner,
      label: 'level',
    },
    createdAt: { type: Date, default: new Date(), label: 'Created at' },
    updatedAt: { type: Date, default: new Date(), label: 'Updated at' },
  },
  {
    timestamps: true,
  },
);
