import { Schema } from 'mongoose';

import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const taskSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      name: { type: String, label: 'Name', required: true },
      description: { type: String, label: 'Description' },
      status: { type: String, label: 'Status', required: true },
      teamId: { type: String, label: 'Team ID', required: true },
      priority: { type: String, label: 'Priority' },
      labelIds: { type: [String], label: 'Label IDs' },
      tagIds: { type: [String], label: 'Tag IDs' },
      assignee: { type: String, label: 'Assignee' },
      cycleId: { type: String, label: 'Cycle ID' },
      projectId: { type: String, label: 'Project ID' },
      estimatedPoint: { type: Number, label: 'Estimated Point' },
    },
    {
      timestamps: true,
    },
  ),
);
