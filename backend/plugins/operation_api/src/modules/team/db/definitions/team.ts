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
    },
    {
      timestamps: true,
    },
  ),
);
