import { Schema } from 'mongoose';
import { field, schemaHooksWrapper } from '../utils/utils';

export const blockSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    contractId: field({
      type: String,
      label: 'Saving Contract Type',
      index: true,
    }),
    blockType: field({
      type: String,
      label: 'Block Type',
      enum: ['scheduleTransaction', 'loanPayment'],
      // loanPayment - orj irenguut ni avah, scheduleTransaction gartsiig haaj baiga
      optional: true,
    }),
    number: field({
      type: String,
      label: 'Number',
      optional: true,
      index: true,
    }),
    amount: field({
      type: Number,
      label: 'Amount',
      default: 0,
      index: true,
    }),
    didAmount: field({
      type: Number,
      label: 'Amount',
      default: 0,
      index: true,
    }),
    status: field({
      type: String,
      label: 'Status',
      optional: true,
      index: true,
    }),
    currency: field({
      type: String,
      label: 'Currency',
      optional: true,
      index: true,
    }),
  }),
  'erxes_contractSchema',
);
