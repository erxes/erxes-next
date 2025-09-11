import { Schema } from 'mongoose';

export const boardSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    userId: { type: String, label: 'Created by' },
    order: { type: Number, label: 'Order' },
    type: {
      type: String,
      required: true,
      label: 'Type',
      default: 'deal',
    },
  },
  {
    timestamps: true,
  },
);
