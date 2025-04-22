import { Schema } from 'mongoose';
import { attachmentSchema } from 'erxes-api-shared/core-modules';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const courseCategorySchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, label: 'Name' },
    code: { type: String, unique: true, label: 'Code' },
    order: { type: String, label: 'Order' },
    parentId: { type: String, optional: true, label: 'Parent ID' },
    description: { type: String, optional: true, label: 'Description' },
    isRoot: { type: Boolean, optional: true, label: 'Is Root' },
    activityCount: {
      type: Number,
      optional: true,
      label: 'Activity Count',
    },
    attachment: {
      type: attachmentSchema,
      optional: true,
      label: 'Image',
    },
  },
  {
    timestamps: true,
  },
);
