import { Schema } from 'mongoose';
import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';

export const periodLockSchema = schemaWrapper(
  new Schema(
    {
      _id: mongooseStringRandomId,
      date: { type: Date, label: 'Lock Date' },
      excludeContracts: {
        type: [String],
        label: 'Exclude contracts from Lock ',
      },
    },
    { timestamps: true },
  ),
);
