import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';
import { JOURNALS, PTR_STATUSES, TR_SIDES, TR_STATUSES } from '../../@types/constants';

export const followDetailSchema = schemaWrapper(
  new Schema({
    id: field({ type: String, index: true, label: 'follow tr id' }),
    type: field({
      type: String, label: 'follow tr type', enum: [
        'currencyDiff',
      ]
    }),
  })
)

export const transactionDetailSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    accountId: field({ type: String, label: 'Account', index: true }),
    followInfos: field({
      type: Object, label: 'Follower tr detail input'
    }),
    follows: field({
      type: [followDetailSchema], label: 'Follower tr detail'
    }),

    side: field({
      type: String,
      enum: TR_SIDES.ALL,
      label: 'Side',
      default: 'new',
      index: true,
    }),
    amount: field({ type: Number, label: 'Amount' }),
    currency: field({ type: String, optional: true, label: 'Currency' }),
    currencyAmount: field({ type: Number, optional: true, label: 'CurrencyAmount' }),
    customRate: field({ type: Number, optional: true, label: 'CustomRate' }),

    assignUserId: field({ type: String, optional: true, esType: 'keyword' }), // AssignUserId

    productId: field({ type: String, optional: true, label: 'Product' }),
    count: field({ type: Number, optional: true, label: 'Count' }),
    unitPrice: field({ type: Number, optional: true, label: 'unitPrice' }),
  })
);

export const followSchema = schemaWrapper(
  new Schema({
    id: field({ type: String, index: true, label: 'follow tr id' }),
    type: field({
      type: String, label: 'follow tr type', enum: [
        'vat', 'ctax'
      ]
    }),
  })
)

export const transactionSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    date: field({ type: Date, label: 'Date' }),
    fullDate: field({ type: Date, index: true, label: 'Date' }),
    description: field({ type: String, optional: true, label: 'Description' }),
    status: field({
      type: String,
      enum: TR_STATUSES.ALL,
      label: 'Status',
      default: 'real',
      index: true,
    }),
    ptrId: field({ type: String, label: 'Group' }),
    parentId: field({ type: String, optional: true, label: 'Parent ID', index: true }),
    number: field({ type: String, optional: true, label: 'Number', index: true }),
    journal: field({
      type: String,
      enum: JOURNALS.ALL,
      default: 'zero',
      label: 'Journal',
      index: true
    }),
    ptrStatus: field({
      type: String,
      enum: PTR_STATUSES.ALL,
      default: 'zero',
      label: 'PTR Status',
      optional: true,
      index: true,
    }),
    originId: field({ type: String, label: 'Source Transaction' }),
    followInfos: field({
      type: Object, label: 'Follower transactions'
    }),
    follows: field({
      type: [followSchema], label: 'Follower transactions'
    }),
    preTrId: field({ type: String, optional: true, label: 'previous transaction', index: true }),

    branchId: field({ type: String, optional: true, label: 'Branch' }),
    departmentId: field({ type: String, optional: true, label: 'Department' }),
    customerType: field({ type: String, optional: true, label: 'Customer type' }),
    customerId: field({ type: String, optional: true, label: 'Customer' }),
    assignedUserIds: field({ type: [String], label: 'Assign Users' }),

    details: field({ type: [transactionDetailSchema], label: 'details' }),
    shortDetail: field({ type: transactionDetailSchema, label: 'short detail' }),
    sumDt: field({ type: Number, label: 'sumDt' }),
    sumCt: field({ type: Number, label: 'sumCt' }),

    createdBy: field({ type: String, label: 'Created user' }),
    modifiedBy: field({ type: String, optional: true, label: 'Modified user' }),
    createdAt: field({ type: Date, default: new Date(), label: 'Created at' }),
    updatedAt: field({ type: Date, optional: true, label: 'Modified at' }),

    // vat 
    hasVat: field({ type: Boolean, optional: true, label: 'hasVat' }),
    vatRowId: field({ type: String, optional: true, label: 'vatRowId' }),
    afterVat: field({ type: Boolean, optional: true, label: 'afterVat' }),
    afterVatAccountId: field({ type: String, optional: true, label: 'afterVatAccountId' }),
    isHandleVat: field({ type: Boolean, optional: true, label: 'isHandleVat' }),
    vatAmount: field({ type: Number, optional: true, label: 'vatAmount' }),

    // ctax
    hasCtax: field({ type: Boolean, optional: true, label: 'hasCtax' }),
    ctaxRowId: field({ type: String, optional: true, label: 'ctaxRowId' }),
    isHandleCtax: field({ type: Boolean, optional: true, label: 'isHandleCtax' }),
    ctaxAmount: field({ type: Number, optional: true, label: 'ctaxAmount' }),

    extraData: field({ type: Object, optional: true })
  }),
);
