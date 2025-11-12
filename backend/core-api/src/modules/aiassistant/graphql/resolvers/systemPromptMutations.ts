import { ISystemPromptDocument } from "~/modules/aiassistant/db/definitions/systemPrompt";
import { SystemPromptModel } from "~/modules/aiassistant/db/models/SystemPrompt";

export const systemPromptMutations = {
  async updateSystemPrompt(
    _parent: any,
    { prompt }: { prompt: string },
    { user }: { user?: { _id?: string } }
  ): Promise<ISystemPromptDocument> {
    if (!user?._id) throw new Error("Not authenticated");

    return await SystemPromptModel.findOneAndUpdate(
      { userId: user._id },
      { prompt },
      { new: true, upsert: true }
    );
  }
};
