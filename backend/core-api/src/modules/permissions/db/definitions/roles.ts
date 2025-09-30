import { Schema } from 'mongoose';
import { PERMISSION_ROLES } from '~/modules/permissions/db/constants';

export const roleSchema = new Schema(
  {
    userId: { type: String, label: 'User' },
    role: {
      type: String,
      enum: PERMISSION_ROLES.ALL,
      label: 'Role',
    },
  },
  {
    timestamps: true,
  },
);

roleSchema.index({ userId: 1, role: 1 }, { unique: true });
