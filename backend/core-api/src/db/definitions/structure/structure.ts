import { Schema } from 'mongoose';
import { commonSchemaFields, contactInfoSchema } from './common';

export const structureSchema = new Schema(
  {
    description: { type: String, optional: true },
    supervisorId: { type: String, optional: true },
    ...contactInfoSchema,
    ...commonSchemaFields,
  },
  {
    timestamps: true,
  },
);
