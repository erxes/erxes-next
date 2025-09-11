import { Schema } from 'mongoose';

export const contractTypeSchema = new Schema({
  code: { type: String, label: 'Code', unique: true },
  name: { type: String, label: 'Name' },
  description: {
    type: String,
    optional: true,
    label: 'Description',
  },
  status: { type: String, default: 'active', label: 'Status' },
  number: { type: String, label: 'Number' },
  vacancy: {
    type: Number,
    min: 1,
    max: 10,
    label: 'Vacancy',
    required: true,
  },

  config: { type: Object },
  currency: {
    type: String,
    default: 'MNT',
    label: 'Currency',
  },
  interestCalcType: {
    type: String,
    label: 'Interest calculate type',
  },
  storeInterestInterval: {
    type: String,
    label: 'Interest store interval',
  },
  interestRate: {
    type: Number,
    min: 0,
    max: 100,
    label: 'Saving Interest Rate',
  },
  closeInterestRate: {
    type: Number,
    min: 0,
    max: 100,
    label: 'Saving Close Interest Rate',
  },
  branchId: { type: String, label: 'Branch Id' },
  isAllowIncome: { type: Boolean, label: 'Is Allow income' },
  isAllowOutcome: { type: Boolean, label: 'Is Allow outcome' },
  isDeposit: { type: Boolean, label: 'Is Deposit' },
  productType: {
    type: String,
    default: 'private',
    label: 'product Type',
  },
  limitPercentage: {
    type: Number,
    label: 'Limit Percentage',
  },
});
