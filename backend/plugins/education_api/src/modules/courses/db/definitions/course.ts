import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const courseSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, label: 'Name' },
    code: { type: String, unique: true, label: 'Code' },
    category: { type: Object, optional: true, label: 'Category' },
    description: { type: String, label: 'Description' },
    createdAt: { type: Date, default: new Date(), label: 'Created At' },
    // type: field({
    //   type: String,
    //   enum: ACTIVITY_TYPES.ALL,
    //   default: ACTIVITY_TYPES.ACTIVITY,
    //   optional: true,
    //   label: 'Type',
    // }),
    // attachment: field({
    //   type: attachmentSchema,
    //   optional: true,
    //   label: 'Attachment',
    // }),

    // searchText: field({ type: String, optional: true, index: true }),
    // status: field({
    //   type: String,
    //   enum: ACTIVITY_STATUSES.ALL,
    //   default: ACTIVITY_STATUSES.DRAFT,
    //   optional: true,
    //   label: 'Status',
    // }),
    startDate: { type: Date, label: 'Start Date' },
    endDate: { type: Date, label: 'End Date' },
    deadline: { type: Date, label: 'Use Finsh Date' },
    unitPrice: { type: Number, optional: true, label: 'Unit price' },
  },
  {
    timestamps: true,
  },
);
