import { Schema } from 'mongoose';
import { commonSchemaFields } from './common';
import { STRUCTURE_STATUSES } from '../../../modules/structure/constants';

export const departmentSchema = new Schema(
  {
    description: { type: String, optional: true },
    supervisorId: { type: String, optional: true },
    parentId: { type: String, optional: true },
    order: { type: String, unique: true },
    status: {
      type: String,
      label: 'Status',
      default: STRUCTURE_STATUSES.ACTIVE,
    },
    workhours: { type: Object, label: 'WorkHours', optional: true },
    ...commonSchemaFields,
  },
  { timestamps: true },
);
