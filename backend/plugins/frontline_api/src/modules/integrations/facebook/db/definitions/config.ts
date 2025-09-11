import { Schema } from 'mongoose';

export const configSchema = new Schema({
  code: { type: String, unique: true },
  value: { type: Object },
});
