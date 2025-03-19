import { Schema } from 'mongoose';
import { stringRandomId } from 'erxes-api-utils';
export const appSchema = new Schema({
  _id: stringRandomId,
  name: { type: String, label: 'App name' },
  createdAt: { type: Date, label: 'Created at', default: new Date() },
  accessToken: { type: String, label: 'Access token' },
  refreshToken: {
    type: String,
    label: 'Refresh token used to gain access token',
  },
  isEnabled: { type: Boolean, label: 'Status of the app' },
  userGroupId: { type: String, label: 'User group id', optional: true },
  expireDate: { type: Date, label: 'Token expire date' },
  noExpire: { type: Boolean, label: 'noExpire' },
  allowAllPermission: { type: Boolean, label: 'allowAllPermission' },
});
