import { Document, Model } from "mongoose";

export interface ISystemPrompt {
  prompt: string; 
  updatedAt?: Date;
}

export interface ISystemPromptDocument extends ISystemPrompt, Document {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISystemPromptModel extends Model<ISystemPromptDocument> {
  getPrompt(): Promise<ISystemPromptDocument | null>; 
  updatePrompt(prompt: string): Promise<ISystemPromptDocument>; 
}

export const systemPromptFields = {
  userId: { type: String, required: true }, 
  prompt: { type: String, default: "" },
};