import { Schema } from 'mongoose';

import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

const metadataSchema = new Schema(
  {
    newValue: { type: String, label: 'New Value' },
    previousValue: { type: String, label: 'Previous Value' },
  },
  {
    _id: false,
  },
);

export const activitySchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      action: { type: String, label: 'Action', required: true },
      contentId: { type: String, label: 'Content ID', required: true },
      module: { type: String, label: 'Module', required: true },
      metadata: { type: metadataSchema, label: 'Metadata' },
      createdBy: { type: String, label: 'Created By' },
    },
    {
      timestamps: true,
    },
  ),
);
