import { Schema } from 'mongoose';
import { commonSchemaFields } from './common';

export const unitSchema = new Schema(
  {
    description: { type: String, optional: true },
    departmentId: { type: String, optional: true },
    supervisorId: { type: String, optional: true },
    userIds: { type: [String], label: 'Related users' },
    ...commonSchemaFields,
  },
  { timestamps: true },
);
