import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const noteSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      content: { type: String },
      itemId: { type: String },
      createdBy: { type: String },
      mentions: { type: [String], default: [] },
    },
    {
      timestamps: true,
    },
  ),
);
