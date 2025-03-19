import { Schema } from 'mongoose';
import { stringRandomId } from 'erxes-api-utils';
export const configSchema = new Schema({
  _id: stringRandomId,
  code: { type: String, unique: true, label: 'Code' },
  value: { type: Object, label: 'Value' },
});
