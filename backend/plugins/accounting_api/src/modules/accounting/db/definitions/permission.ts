import { Schema } from 'mongoose';
import { field } from './utils';
import { ACCOUNT_PERM_LEVELS } from '../../@types/permission';

// Mongoose schemas ===========

export const permissionSchema = new Schema({
  _id: field({ pkey: true }),
  userId: field({ type: String, index: true, label: 'User' }),
  accountId: field({ type: String, index: true, label: 'Account' }),
  permission: field({
    type: String,
    label: 'Permission',
    enum: ACCOUNT_PERM_LEVELS.ALL,
    default: ACCOUNT_PERM_LEVELS.READ
  }),
  createdAt: field({ type: Date }),
  updatedAt: field({ type: Date })
});
