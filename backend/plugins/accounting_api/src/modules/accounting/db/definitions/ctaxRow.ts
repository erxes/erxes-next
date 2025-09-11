import { Schema } from 'mongoose';
import { CTAX_ROW_STATUS, CtaxRowKinds } from '../../@types/ctaxRow';

export const ctaxRowSchema = new Schema({
  name: { type: String },
  number: { type: String },
  kind: { type: String, enum: CtaxRowKinds.ALL },
  formula: { type: String, optional: true },
  formula_text: { type: String, optional: true },
  status: {
    type: String,
    enum: CTAX_ROW_STATUS.ALL,
    label: 'Status',
    default: 'active',
    index: true,
  },
  percent: { type: Number, default: 0 },
});
