import { SystemPromptModel } from "~/modules/aiassistant/db/models/SystemPrompt";

export const systemPromptQueries = {
  async getSystemPrompt(_parent, _args, { user }) {
    if (!user?._id) {
      throw new Error("User not authenticated");
    }

    return await SystemPromptModel.findOne({ userId: user._id }).exec();
  }
};