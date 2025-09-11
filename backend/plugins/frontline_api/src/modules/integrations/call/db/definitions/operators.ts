import { Schema } from 'mongoose';

export const operatorSchema = new Schema({
  userId: { type: String, label: 'user id', unique: true },
  extension: { type: String, label: 'Operator extension' },
  status: {
    type: String,
    label: 'Operator extension',
    enum: ['unAvailable', 'idle', 'pause', 'unpause'],
    default: 'unAvailable',
  },
});
