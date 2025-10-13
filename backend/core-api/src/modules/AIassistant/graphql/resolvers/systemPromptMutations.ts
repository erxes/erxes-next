import { ISystemPromptDocument } from "~/modules/AIassistant/db/definitions/systemPrompt";
import { SystemPromptModel } from "~/modules/AIassistant/db/models/SystemPrompt";

export interface SystemPromptMutationResolvers {
  updateSystemPrompt: (
    _parent: any,
    args: { prompt: string }
  ) => Promise<ISystemPromptDocument>;
}

export const mutationResolvers = {
  updateSystemPrompt: async (
    _parent: any,
    { prompt }: { prompt: string }
  ): Promise<ISystemPromptDocument> => {
    return await SystemPromptModel.updatePrompt(prompt);
  },
};