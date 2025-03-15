import { Schema } from 'mongoose';
import { commonSchemaFields, contactInfoSchema } from './common';
import { STRUCTURE_STATUSES } from '../../../modules/structure/constants';

export const branchSchema = new Schema(
  {
    parentId: { type: String, optional: true },
    ...contactInfoSchema,
    ...commonSchemaFields,
    order: { type: String, unique: true },
    status: {
      type: String,
      label: 'Status',
      default: STRUCTURE_STATUSES.ACTIVE,
    },
    supervisorId: { type: String, optional: true },
    radius: { type: Number, label: 'Coordinate radius /M/' },
    workhours: { type: Object, label: 'WorkHours', optional: true },
  },
  { timestamps: true },
);
