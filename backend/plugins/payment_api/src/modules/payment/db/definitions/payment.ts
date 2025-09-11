import { Schema } from 'mongoose';
import { CURRENCIES, PAYMENTS } from '~/constants';

export const paymentSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    kind: { type: String, label: 'Kind', enum: PAYMENTS.ALL },
    status: { type: String, label: 'Status' },
    config: { type: Object, label: 'Config' },
    acceptedCurrencies: {
      type: [String],
      label: 'Accepted currencies',
      enum: CURRENCIES,
    },
  },
  {
    timestamps: true,
  },
);
