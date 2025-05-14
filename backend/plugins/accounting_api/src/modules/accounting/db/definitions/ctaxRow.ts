import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';
import { CTAX_ROW_STATUS, CtaxRowKinds } from '../../@types/ctaxRow';

export const ctaxRowSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String }),
    number: field({ type: String }),
    kind: field({ type: String, enum: CtaxRowKinds.ALL }),
    formula: field({ type: String, optional: true }),
    formula_text: field({ type: String, optional: true }),
    status: field({
      type: String,
      enum: CTAX_ROW_STATUS.ALL,
      label: 'Status',
      default: 'active',
      index: true,
    }),
    percent: field({ type: Number, default: 0 }),
  }),
);
