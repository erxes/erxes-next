import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';
import { ADJ_INV_STATUSES } from '../../@types/adjustInventory';

export const adjustInvDetailsSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    adjustId: field({ type: String, optional: true, label: 'Adjust inventory' }),
    productId: field({ type: String, optional: true, label: 'Product' }),
    accountId: field({ type: String, label: 'account' }),
    branchId: field({ type: String, label: 'branch' }),
    departmentId: field({ type: String, label: 'department' }),
    remainder: field({ type: Number, optional: true, label: 'remainder' }),
    cost: field({ type: Number, optional: true, label: 'cost' }),
    unitCost: field({ type: Number, optional: true, label: 'unitCost' }),
    soonInCount: field({ type: Number, optional: true, label: 'soonInCount' }),
    soonOutCount: field({ type: Number, optional: true, label: 'soonOutCount' }),
    error: field({ type: String, optional: true, label: 'error' }),
    warning: field({ type: String, optional: true, label: 'warning' }),
    createdAt: field({ type: Date, default: new Date(), label: 'Created at' }),
    updatedAt: field({ type: Date, optional: true, label: 'Modified at' }),
  })
);

export const adjustInventoriesSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    date: field({ type: Date, label: 'date' }),
    description: field({ type: String, label: 'description' }),
    status: field({ type: String, default: 'draft', enum: ADJ_INV_STATUSES.all, label: 'status' }),
    error: field({ type: String, optional: true, label: 'error' }),
    warning: field({ type: String, optional: true, label: 'warning' }),
    beginDate: field({ type: Date, label: 'date' }),
    checkedDate: field({ type: Date, label: 'date' }),
    successDate: field({ type: Date, label: 'current date' }),
    createdBy: field({ type: String, label: 'Created user' }),
    modifiedBy: field({ type: String, optional: true, label: 'Modified user' }),
    createdAt: field({ type: Date, default: new Date(), label: 'Created at' }),
    updatedAt: field({ type: Date, optional: true, label: 'Modified at' }),
  }),
);
