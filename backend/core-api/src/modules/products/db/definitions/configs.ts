import { Schema } from 'mongoose';

export const productsConfigSchema = new Schema({
  code: { type: String, unique: true },
  value: { type: Object },
});
