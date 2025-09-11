import { TIMELY_TYPES } from '@/products/constants';
import { Schema } from 'mongoose';

const subscriptionConfigSchema = new Schema({
  period: { type: String, label: 'Subscription Period' },
  rule: { type: String, label: 'Subscription Rule' },
  specificDay: {
    type: String,
    label: 'Subscription Start Day',
    optional: true,
  },

  subsRenewable: {
    type: Boolean,
    label: 'Subscription Renewable',
    optional: true,
  },
});

export const uomSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    code: { type: String, unique: true, label: 'Code' },
    isForSubscription: {
      type: Boolean,
      optional: true,
      label: 'Uom for subscription',
    },
    subscriptionConfig: {
      type: subscriptionConfigSchema,
      optional: true,
      label: 'Subscription configuration',
    },
    timely: {
      type: String,
      optional: true,
      label: 'Timely',
      enum: TIMELY_TYPES.ALL,
    },
  },
  {
    timestamps: true,
  },
);

export const subUomSchema = new Schema({
  uom: { type: String, label: 'Sub unit of measurement' },
  ratio: { type: Number, label: 'ratio of sub uom to main uom' },
});
