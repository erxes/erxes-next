import { Schema } from 'mongoose';

import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const statusSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      name: { type: String, label: 'Name', required: true },
      description: { type: String, label: 'Description' },
      color: { type: String, label: 'Color' },
      type: { type: String, label: 'Type', required: true },
      teamId: { type: String, label: 'Team ID', required: true },
    },
    {
      timestamps: true,
    },
  ),
);
