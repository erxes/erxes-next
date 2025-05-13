import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { COURSE_STATUSES, COURSE_TYPES } from '@/courses/constants';
import { attachmentSchema } from 'erxes-api-shared/core-modules';

export const courseSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, label: 'Name' },
    code: { type: String, unique: true, label: 'Code' },
    categoryId: { type: String, optional: true, label: 'Category ID' },
    category: { type: Object, optional: true, label: 'Category' },
    description: { type: String, label: 'Description' },
    createdAt: { type: Date, default: new Date(), label: 'Created At' },
    type: {
      type: String,
      enum: COURSE_TYPES.ALL,
      default: COURSE_TYPES.Training,
      label: 'Type',
    },
    attachment: {
      type: attachmentSchema,
    },

    searchText: { type: String, optional: true, index: true },
    status: {
      type: String,
      enum: COURSE_STATUSES.ALL,
      default: COURSE_STATUSES.DRAFT,
      optional: true,
      label: 'Status',
    },
    startDate: { type: Date, label: 'Start Date' },
    endDate: { type: Date, label: 'End Date' },
    deadline: { type: Date, label: 'Use Finsh Date' },
    unitPrice: { type: Number, optional: true, label: 'Unit price' },
  },
  {
    timestamps: true,
  },
);
