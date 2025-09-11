import { Schema } from 'mongoose';

export const savingSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
  },
  {
    timestamps: true,
  },
);
