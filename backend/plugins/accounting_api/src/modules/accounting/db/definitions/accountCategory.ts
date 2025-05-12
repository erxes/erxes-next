import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';
import { ACCOUNT_CATEGORY_MASK_TYPES, ACCOUNT_CATEGORY_STATUSES } from '../../@types/constants';

export const accountCategorySchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Name' }),
    code: field({ type: String, unique: true, label: 'Code' }),
    order: field({ type: String, label: 'Order' }),
    parentId: field({ type: String, optional: true, label: 'Parent' }),
    description: field({ type: String, optional: true, label: 'Description' }),
    status: field({
      type: String,
      enum: ACCOUNT_CATEGORY_STATUSES.ALL,
      optional: true,
      label: 'Status',
      default: 'active',
      esType: 'keyword',
      index: true,
    }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Created at',
    }),
    maskType: field({
      type: String,
      optional: true,
      label: 'Mask type',
      enum: ACCOUNT_CATEGORY_MASK_TYPES.ALL,
    }),
    mask: field({ type: Object, label: 'Mask', optional: true }),
  }),
);
