import { Schema } from 'mongoose';

import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const projectSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      name: { type: String, label: 'Name', required: true },
      description: { type: String, label: 'Description' },
      status: { type: Number, label: 'Status', required: true, default: 0 },
      priority: { type: Number, label: 'Priority', required: true, default: 0 },
      icon: { type: String, label: 'Icon', default: 'IconBox' },
      teamIds: { type: [String], label: 'Team ID', required: true },
      startDate: { type: Date, label: 'Start Date' },
      targetDate: { type: Date, label: 'Target Date' },
      leadId: { type: String, label: 'Lead ID' },
    },
    {
      timestamps: true,
    },
  ),
);
