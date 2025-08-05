import { schemaHooksWrapper, field } from './utils';
import { Schema } from 'mongoose';

export const contractTypeSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    code: field({ type: String, label: 'Code', unique: true }),
    name: field({ type: String, label: 'Name' }),
    description: field({
      type: String,
      optional: true,
      label: 'Description',
    }),
    status: field({ type: String, default: 'active', label: 'Status' }),
    number: field({ type: String, label: 'Number' }),
    vacancy: field({
      type: Number,
      min: 1,
      max: 10,
      label: 'Vacancy',
      required: true,
    }),

    config: field({ type: Object }),
    currency: field({
      type: String,
      default: 'MNT',
      label: 'Currency',
    }),
    interestCalcType: field({
      type: String,
      label: 'Interest calculate type',
    }),
    storeInterestInterval: field({
      type: String,
      label: 'Interest store interval',
    }),
    interestRate: field({
      type: Number,
      min: 0,
      max: 100,
      label: 'Saving Interest Rate',
    }),
    closeInterestRate: field({
      type: Number,
      min: 0,
      max: 100,
      label: 'Saving Close Interest Rate',
    }),
    branchId: field({ type: String, label: 'Branch Id' }),
    isAllowIncome: field({ type: Boolean, label: 'Is Allow income' }),
    isAllowOutcome: field({ type: Boolean, label: 'Is Allow outcome' }),
    isDeposit: field({ type: Boolean, label: 'Is Deposit' }),
    productType: field({
      type: String,
      default: 'private',
      label: 'product Type',
    }),
    limitPercentage: field({
      type: Number,
      label: 'Limit Percentage',
    }),
  }),
  'erxes_contractTypeSchema',
);
