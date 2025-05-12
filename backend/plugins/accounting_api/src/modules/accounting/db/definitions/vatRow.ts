import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';
import { VAT_ROW_STATUS, VatRowKinds } from '../../@types/vatRow';

export const vatRowSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String }),
    number: field({ type: String }),
    kind: field({ type: String, enum: VatRowKinds.ALL }),
    formula: field({ type: String, optional: true }),
    formula_text: field({ type: String, optional: true }),
    tabCount: field({ type: Number, default: 0 }),
    isBold: field({ type: Boolean, default: false }),
    status: field({
      type: String,
      enum: VAT_ROW_STATUS.ALL,
      label: 'Status',
      default: 'active',
      index: true,
    }),
    percent: field({ type: Number, default: 0 }),
  }),
);
