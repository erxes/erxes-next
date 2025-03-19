import { stringRandomId } from 'erxes-api-utils';
import { Schema } from 'mongoose';

export const clientSchema = new Schema({
  _id: stringRandomId,
  name: { type: String, label: 'Name', unique: true, required: true },
  clientId: { type: String, label: 'Client id', unique: true },
  clientSecret: { type: String, label: 'Client secret' },
  refreshToken: { type: String, label: 'Refresh token' },
  whiteListedIps: { type: [String], label: 'White listed ips' },
  createdAt: { type: Date, label: 'Created at', default: Date.now },
});
