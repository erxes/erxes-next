import { Schema } from 'mongoose';

import { mongooseStringRandomId } from 'erxes-api-shared/utils';

export const classSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    name: { type: String, required: true, label: 'Class Name' },
    courseID: { type: String, required: true, label: 'Course ID' },
    dates: { type: Array, required: true, label: 'Dates' },
    startTime: { type: Date, label: 'Class start time' },
    endTime: { type: Date, label: 'Class end time' },
    limit: { type: Number, label: 'Limit of students' },
    entries: { type: Number, label: 'Class Entries' },
    createdAt: { type: Date, default: new Date(), label: 'Created at' },
    modifiedAt: { type: Date, default: new Date(), label: 'Modified at' },
    schedules: { type: Array, required: true, label: 'Schedule dates' },
  },
  {
    timestamps: true,
  },
);
