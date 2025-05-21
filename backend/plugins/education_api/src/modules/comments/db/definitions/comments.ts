import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const commentSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    courseId: { type: String, label: 'Course Id' },
    content: { type: String, label: 'Content' },
    parentId: { type: String, label: 'Parent Id' },
    createdAt: { type: Date, label: 'Created at' },
  },
  {
    timestamps: true,
  },
);
