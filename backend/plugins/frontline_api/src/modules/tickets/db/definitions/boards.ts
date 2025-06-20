import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const boardSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, label: 'Name' },
    order: { type: Number, label: 'Order' },
    type: {
      type: String,
      label: 'Type',
      default: 'ticket',
    },
  },
  {
    timestamps: true,
  },
);
