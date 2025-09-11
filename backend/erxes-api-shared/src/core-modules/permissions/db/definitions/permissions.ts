import { Schema } from 'mongoose';

export const userGroupSchema = new Schema({
  name: { type: String, unique: true, label: 'Name' },
  description: { type: String, label: 'Description' },
  branchIds: {
    type: [String],
    label: 'Branches',
    optional: true,
  },
  departmentIds: {
    type: [String],
    label: 'Departments',
    optional: true,
  },
});

export const permissionSchema = new Schema({
  module: { type: String, label: 'Module' },
  action: { type: String, label: 'Action' },
  userId: { type: String, label: 'User' },
  groupId: { type: String, label: 'User group' },
  requiredActions: {
    type: [String],
    default: [],
    label: 'Required actions',
  },
  allowed: { type: Boolean, default: false, label: 'Allowed' },
});
