import { ISystemPromptDocument } from "~/modules/AIassistant/db/definitions/systemPrompt";
import { SystemPromptModel } from "~/modules/AIassistant/db/models/SystemPrompt";

export interface SystemPromptQueryResolvers {
  getSystemPrompt: () => Promise<ISystemPromptDocument | null>;
}

export const queryResolvers = {
  getSystemPrompt: async (): Promise<ISystemPromptDocument | null> => {
    return await SystemPromptModel.getPrompt();
  },
};