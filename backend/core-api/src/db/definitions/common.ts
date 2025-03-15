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

export const CoordinateSchame = new Schema(
  {
    longitude: { type: String, optional: true },
    latitude: { type: String, optional: true },
  },
  { _id: false },
);
