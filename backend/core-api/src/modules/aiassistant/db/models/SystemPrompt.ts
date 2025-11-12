import { Schema, model, Model } from "mongoose";
import {
  ISystemPromptDocument,
  ISystemPromptModel,
  systemPromptFields,
} from "../definitions/systemPrompt";

export const SystemPromptSchema = new Schema<ISystemPromptDocument>(
  systemPromptFields,
  {
    timestamps: true,
    collection: 'system_prompts'
  }
);

SystemPromptSchema.statics.getPrompt = function () {
  return this.findOne().exec();
};

SystemPromptSchema.statics.updatePrompt = async function (prompt: string) {
  const updated = await this.findOneAndUpdate(
    {},
    { 
      prompt, 
      updatedAt: new Date() 
    },
    { 
      new: true, 
      upsert: true
    }
  ).exec();
  
  return updated;
};

export const SystemPromptModel = model<ISystemPromptDocument, ISystemPromptModel>(
  "system_prompt",
  SystemPromptSchema
);