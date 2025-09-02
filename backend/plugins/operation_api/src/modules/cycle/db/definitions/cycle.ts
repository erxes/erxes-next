import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const cycleSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      name: { type: String },
      description: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      teamId: { type: String },
      isCompleted: { type: Boolean, default: false },
      isActive: { type: Boolean, default: false },
      statistics: { type: Object },
      donePercent: { type: Number, default: 0 },
      unFinishedTasks: { type: [String], default: [] },
      number: { type: Number, default: 0 },
    },
    {
      timestamps: true,
    },
  ),
);
