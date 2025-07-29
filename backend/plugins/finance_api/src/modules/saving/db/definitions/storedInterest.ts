import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const storedInterestSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      number: {
        type: String,
        label: 'Number',
        index: true,
      },
      description: { type: String, optional: true, label: 'Description' },
      type: { type: String, optional: true, label: 'Description' },
      invDate: {
        type: Date,
        default: new Date(),
        label: 'invoice date',
      },
      prevStoredDate: {
        type: Date,
        default: new Date(),
        label: 'Prev stored date',
      },
      contractId: { type: String, min: 0, label: 'contractId' },
      amount: { type: Number, min: 0, label: 'amount' },
      periodLockId: { type: String, min: 0, label: 'periodLockId' },
      createdAt: {
        type: Date,
        default: () => new Date(),
        label: 'Created at',
      },
      createdBy: { type: String, optional: true, label: 'created member' },
    },
    { timestamps: true },
  ),
);
