import { Schema } from 'mongoose';

export const customFieldSchema = new Schema(
  {
    field: { type: 'String' },
    value: { type: Schema.Types.Mixed },
    stringValue: { type: 'String', optional: true },
    numberValue: { type: 'Number', optional: true },
    dateValue: { type: 'Date', optional: true },
  },
  { _id: false },
);

// schema for form's rules
export const ruleSchema = new Schema(
  {
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

export const attachmentSchema = new Schema(
  {
    name: { type: String },
    url: { type: String },
    type: { type: String },
    size: { type: Number, optional: true },
    duration: { type: Number, optional: true },
  },
  { _id: false },
);
