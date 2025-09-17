import { Schema } from 'mongoose';

export const planSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);
