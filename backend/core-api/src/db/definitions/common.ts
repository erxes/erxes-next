import { Schema } from 'mongoose';

export const customFieldSchema = new Schema(
  {
    field: { type: String },
    value: { type: Schema.Types.Mixed },
    stringValue: { type: String, optional: true },
    numberValue: { type: Number, optional: true },
    dateValue: { type: Date, optional: true },
  },
  { _id: false },
);

export const ruleSchema = new Schema(
  {
    _id: { type: String },

    // browserLanguage, currentUrl, etc ...
    kind: { type: String, label: 'Kind' },

    // Browser language, Current url etc ...
    text: { type: String, label: 'Text' },

    // is, isNot, startsWith
    condition: { type: String, label: 'Condition' },

    value: { type: String, label: 'Value', optional: true },
  },
  { _id: false },
);
