import { IModels } from '~/connectionResolvers';
import { ragInteractionSchema } from './RagInteractions';
import { IRagInteractionDocument, IRagInteraction } from '../definitions/ragInteractions';

export const loadRagInteractionClass = (models: IModels) => {
  class RagInteraction {
    public static async getRagInteraction(_id: string) {
      const ragInteraction = await models.RagInteractions.findOne({ _id });

      if (!ragInteraction) {
        throw new Error('RagInteraction not found');
      }

      return ragInteraction;
    }
  }

  ragInteractionSchema.loadClass(RagInteraction);
  return ragInteractionSchema;
};