import { Schema } from 'mongoose';

import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const sampleSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      name: { type: String, label: 'Name' },
      description: { type: String, label: 'Description' },
    },
    {
      timestamps: true,
    },
  ),
);
