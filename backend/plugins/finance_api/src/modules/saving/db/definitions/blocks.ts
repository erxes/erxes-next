import { Schema } from 'mongoose';
import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const blockSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      contractId: {
        type: String,
        label: 'Saving Contract Type',
        index: true,
      },
      blockType: {
        type: String,
        label: 'Block Type',
        enum: ['scheduleTransaction', 'loanPayment'],
        // loanPayment - orj irenguut ni avah, scheduleTransaction gartsiig haaj baiga
        optional: true,
      },
      number: {
        type: String,
        label: 'Number',
        optional: true,
        index: true,
      },
      amount: {
        type: Number,
        label: 'Amount',
        default: 0,
        index: true,
      },
      didAmount: {
        type: Number,
        label: 'Amount',
        default: 0,
        index: true,
      },
      status: {
        type: String,
        label: 'Status',
        optional: true,
        index: true,
      },
      currency: {
        type: String,
        label: 'Currency',
        optional: true,
        index: true,
      },
    },
    { timestamps: true },
  ),
);
