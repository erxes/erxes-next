import { customFieldSchema } from 'erxes-api-shared/core-modules';
import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { CONTRACT_STATUS } from '~/modules/saving/@types/constants';

export const contractSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,

      contractTypeId: { type: String, label: 'Contract Type', index: true },

      number: { type: String, label: 'Number', optional: true, index: true },

      status: {
        type: String,
        label: 'Status',
        enum: CONTRACT_STATUS.ALL,
        required: true,
        default: CONTRACT_STATUS.NORMAL,
      },

      branchId: { type: String, optional: true, label: 'Branch Id' },

      description: { type: String, optional: true, label: 'Description' },

      savingAmount: {
        type: Number,
        default: 0,
        optional: true,
        label: 'Saving amount',
      },

      blockAmount: {
        type: Number,
        default: 0,
        optional: true,
        label: 'Block amount',
      },

      duration: {
        type: Number,
        min: 0,
        max: 600,
        label: 'Saving duration (in months)',
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

      customerId: { type: String, optional: true, label: 'Customer ID' },

      customerType: { type: String, optional: true, label: 'Customer Type' },

      closeDate: { type: Date, optional: true, label: 'Close Date' },

      closeType: { type: String, optional: true, label: 'Close Type' },

      closeDescription: {
        type: String,
        optional: true,
        label: 'Close Description',
      },

      dealId: {
        type: String,
        optional: true,
        label: 'contract relation of dealId',
      },

      currency: {
        type: String,
        default: 'MNT',
        label: 'contract currency of saving',
      },

      storedInterest: {
        type: Number,
        optional: true,
        default: 0,
        label: 'Stored Interest',
      },

      lastStoredDate: { type: Date, optional: true, label: 'Last Stored Date' },

      interestCalcType: { type: String, label: 'Interest calculate type' },
      storeInterestInterval: {
        type: String,
        label: 'Interest store interval',
      },

      isAllowIncome: { type: Boolean, label: 'Is Allow income' },
      isAllowOutcome: { type: Boolean, label: 'Is Allow outcome' },
      isDeposit: { type: Boolean, label: 'Is Deposit' },
      interestGiveType: { type: String, label: 'Interest give type' },

      closeOrExtendConfig: { type: String, label: 'Close or extend config' },

      depositAccount: { type: String, label: 'Deposit account' },

      customFieldsData: {
        type: [customFieldSchema],
        optional: true,
        label: 'Custom fields data',
      },

      isSyncedPolaris: {
        type: Boolean,
        label: 'Is Synced polaris',
        optional: true,
      },

      isActiveSaving: {
        type: Boolean,
        label: 'Is Active savings',
        optional: true,
      },
    },
    { timestamps: true },
  ),
);
