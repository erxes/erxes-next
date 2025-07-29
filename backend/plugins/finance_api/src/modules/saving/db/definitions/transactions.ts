import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const transactionSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      number: {
        type: String,
        label: 'Number',
        index: true,
      },
      contractId: {
        type: String,
        optional: true,
        label: 'Contract',
        index: true,
      },
      customerId: {
        type: String,
        optional: true,
        label: 'Customer',
        index: true,
      },
      companyId: {
        type: String,
        optional: true,
        label: 'Company',
        index: true,
      },
      transactionType: {
        type: String,
        optional: true,
        label: 'Transaction type',
      },
      description: { type: String, optional: true, label: 'Description' },
      payDate: {
        type: Date,
        default: new Date(),
        label: 'Created at',
      },
      payment: {
        type: Number,
        min: 0,
        default: 0,
        optional: true,
        label: 'payment',
      },
      storedInterest: {
        type: Number,
        min: 0,
        default: 0,
        optional: true,
        label: 'stored interest',
      },
      total: { type: Number, min: 0, default: 0, label: 'total' },
      balance: { type: Number, min: 0, default: 0, label: 'balance' },
      currency: {
        type: String,
        default: 'MNT',
        label: 'transaction currency of saving',
      },
      contractReaction: { type: Object, label: 'Contract reaction' },
      storeReaction: { type: Object, label: 'Contract reaction' },
      isManual: { type: Boolean, label: 'Is manual transaction' },
      dealtType: { type: String, label: 'dealtType' },
      dealtResponse: { type: Schema.Types.Mixed, label: 'dealtResponse' },
      accountNumber: { type: String, label: 'accountNumber' },
      accountHolderName: { type: String, label: 'accountHolderName' },
      externalBankName: { type: String, label: 'externalBankName' },
      ownBankNumber: { type: String, label: 'ownBankNumber' },
      ownBankType: { type: String, label: 'ownBankType' },
    },
    { timestamps: true },
  ),
);
