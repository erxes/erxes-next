import { schemaHooksWrapper, field } from '~/modules/saving/db/utils/utils';

import { Schema } from 'mongoose';

export const periodLockSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    date: field({ type: Date, label: 'Lock Date' }),
    excludeContracts: field({
      type: [String],
      label: 'Exclude contracts from Lock ',
    }),
  }),
  'erxes_periodLockSchema',
);
