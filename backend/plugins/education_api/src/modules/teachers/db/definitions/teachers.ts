import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const teacherSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    userId: { type: String, label: 'User Id' },
    createdAt: { type: Date, label: 'Created at' },
  },
  {
    timestamps: true,
  },
);
