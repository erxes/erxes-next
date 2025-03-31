import { mongoStringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';

export const productsConfigSchema = new Schema({
  _id: mongoStringRandomId,
  code: { type: String, unique: true },
  value: { type: Object },
});
