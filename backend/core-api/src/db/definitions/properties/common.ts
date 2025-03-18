import { INPUT_TYPE } from 'backend/core-api/src/modules/properties/contants';
import { Schema } from 'mongoose';

export const logicSchema = new Schema(
  {
    fieldId: { type: String },
    logicOperator: {
      type: String,
      optional: true,
    },
    logicValue: {
      type: Schema.Types.Mixed,
      optional: true,
    },
  },
  { _id: false },
);

export const ObjectListSchema = new Schema({
  key: { type: String, optional: true, label: 'Key' },
  label: { type: String, optional: true, label: 'Label' },
  type: {
    type: String,
    enum: INPUT_TYPE.map((option) => option.value),
    optional: true,
    label: 'Type',
  },
});
