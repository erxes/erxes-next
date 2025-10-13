// backend/core-api/src/modules/AIassistant/db/models/RagInteractions.ts
import { Schema, model, models, Document, Model } from 'mongoose';
import { field, stringField, numberField, dateField } from '../../utils/schemaField';
import { IRagInteraction } from '../definitions/ragInteractions';

export interface IRagInteractionDocument extends IRagInteraction, Document {}

export interface IRagInteractionModel extends Model<IRagInteractionDocument> {
  getRagInteraction(_id: string): Promise<IRagInteractionDocument>;
}

export const ragInteractionSchema = new Schema({
  question: stringField({ label: 'Question' }),
  answer: stringField({ label: 'Answer' }),
  sourceDocuments: field({
    type: [String],
    label: 'Source Documents',
    optional: true
  }),
  userId: stringField({ label: 'User ID' }),
  orgId: stringField({ label: 'Organization ID' }),
  createdAt: dateField({
    default: Date.now,
    label: 'Created at',
    immutable: true
  }),
  modelUsed: stringField({
    label: 'Model Used',
    optional: true
  }),
  responseTime: numberField({
    label: 'Response Time (ms)',
    optional: true,
    min: 0
  }),
  tokensUsed: numberField({
    label: 'Tokens Used',
    optional: true,
    min: 0
  }),
  confidenceScore: numberField({
    label: 'Confidence Score',
    optional: true,
    min: 0,
    max: 1
  }),
  status: stringField({
    label: 'Status',
    enum: ['success', 'error', 'pending'],
    default: 'success'
  }),
  errorMessage: stringField({
    label: 'Error Message',
    optional: true
  })
}, {
  timestamps: true,
  collection: 'rag_interactions'
});

// Add indexes for better query performance
ragInteractionSchema.index({ userId: 1, createdAt: -1 });
ragInteractionSchema.index({ orgId: 1 });
ragInteractionSchema.index({ status: 1 });

export const RagInteractions = models.RagInteractions ||
  model<IRagInteractionDocument, IRagInteractionModel>('rag_interactions', ragInteractionSchema);