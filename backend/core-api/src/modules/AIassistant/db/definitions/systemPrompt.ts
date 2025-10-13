import { Document, Model } from "mongoose";

export interface ISystemPrompt {
  prompt: string; // Remove orgId
  updatedAt?: Date;
}

export interface ISystemPromptDocument extends ISystemPrompt, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISystemPromptModel extends Model<ISystemPromptDocument> {
  getPrompt(): Promise<ISystemPromptDocument | null>; // Remove orgId parameter
  updatePrompt(prompt: string): Promise<ISystemPromptDocument>; // Remove orgId parameter
}

export const systemPromptFields = {
  prompt: { type: String, default: "" } // Remove orgId field
};