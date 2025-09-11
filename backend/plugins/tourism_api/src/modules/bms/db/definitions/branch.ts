import { Schema } from 'mongoose';

export const branchSchema = new Schema({
  name: { type: String, label: 'Name' },
  description: { type: String, label: 'Description', optional: true },
  userId: { type: String, optional: true, label: 'Created by' },
  createdAt: { type: Date, label: 'Created at' },
  generalManagerIds: { type: [String], label: 'general manager user ids' },
  managerIds: { type: [String], label: 'manager user ids' },
  paymentIds: { type: [String], label: 'Online Payments' },
  paymentTypes: { type: [Object], label: 'Other Payments' },
  token: { type: String, label: 'token' },
  uiOptions: { type: Object, label: 'UI Options' },
  erxesAppToken: { type: String, label: 'Erxes App token' },
  permissionConfig: {
    type: Object,
    optional: true,
    label: 'Permission',
  },
  status: { type: String, label: 'Status', optional: true },
});
