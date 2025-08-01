import { Schema } from 'mongoose';

import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const projectSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      name: { type: String, label: 'Name', required: true },
      description: { type: String, label: 'Description' },
      status: { type: String, label: 'Status', required: true },
      priority: { type: String, label: 'Priority' },
      teamId: { type: String, label: 'Team ID', required: true },
      startDate: { type: Date, label: 'Start Date', required: true },
      endDate: { type: Date, label: 'End Date', required: true },
    },
    {
      timestamps: true,
    },
  ),
);
