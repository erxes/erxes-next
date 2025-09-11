import { LOG_TYPES } from '@/integrations/facebook/constants';
import { Schema } from 'mongoose';
export const logSchema = new Schema({
  type: { type: String, enum: LOG_TYPES.ALL },
  value: { type: Object },
  specialValue: { type: String },
  createdAt: { type: Date },
});
