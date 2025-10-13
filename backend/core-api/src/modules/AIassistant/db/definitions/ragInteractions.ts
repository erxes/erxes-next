import { Document } from 'mongoose';

export interface IRagInteraction {
  question: string;
  answer: string;
  sourceDocuments?: string[];
  userId: string;
  orgId: string;
  createdAt: Date;
  modelUsed?: string;
  responseTime?: number;
  tokensUsed?: number;
  confidenceScore?: number;
  status: 'success' | 'error' | 'pending';
  errorMessage?: string;
}

export interface IRagInteractionDocument extends IRagInteraction, Document {}

// Export the fields as a string
export const ragInteractionFields = `
  question: String
  answer: String
  sourceDocuments: [String]
  userId: String
  orgId: String
  createdAt: Date
  modelUsed: String
  responseTime: Float
  tokensUsed: Float
  confidenceScore: Float
  status: String
  errorMessage: String
`;