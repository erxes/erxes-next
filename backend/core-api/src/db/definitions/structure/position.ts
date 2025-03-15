import { STRUCTURE_STATUSES } from '../../../modules/structure/constants';
import { commonSchemaFields } from './common';
import { Schema } from 'mongoose';

export const positionSchema = new Schema({
  ...commonSchemaFields,
  parentId: { type: String, optional: true },
  order: { type: String, unique: true },
  userIds: { type: [String], label: 'Related users' },
  status: {
    type: String,
    label: 'Status',
    default: STRUCTURE_STATUSES.ACTIVE,
  },
});
