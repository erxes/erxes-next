import { Schema } from 'mongoose';

export const pipelineLabelSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
    colorCode: { type: String, label: 'Color code' },
    pipelineId: { type: String, label: 'Pipeline' },
    userId: { type: String, label: 'Created by' },
  },
  {
    timestamps: true,
  },
);

pipelineLabelSchema.index(
  { pipelineId: 1, name: 1, colorCode: 1 },
  { unique: true },
);
