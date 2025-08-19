import { Schema } from 'mongoose';

import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const teamSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      icon: { type: String, label: 'Icon' },
      memberIds: { type: [String], label: 'Member IDs' },
      name: { type: String, label: 'Name' },
      description: { type: String, label: 'Description' },
      estimateType: { type: Number, label: 'Estimate Type' },
    },
    {
      timestamps: true,
    },
  ),
);

export const teamMembers = schemaWrapper(
  new Schema({
    memberId: { type: String, label: 'Member ID' },
    teamId: { type: String, label: 'Team ID' },
    role: { type: String, label: 'Role' },
  }),
);
