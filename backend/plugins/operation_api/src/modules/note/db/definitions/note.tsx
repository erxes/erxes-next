import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const noteSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      content: { type: String },
      itemId: { type: String },
      userId: { type: String },
    },
    {
      timestamps: true,
    },
  ),
);
