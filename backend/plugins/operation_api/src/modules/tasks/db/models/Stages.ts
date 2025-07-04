import { IOrderInput } from 'erxes-api-shared/core-types';
import { sendTRPCMessage, updateOrder } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IStage, IStageDocument } from '~/modules/tasks/@types/stages';
import { stageSchema } from '~/modules/tasks/db/definitions/stages';
import { removeTasks } from '~/modules/tasks/db/models/utils';

export interface IStageModel extends Model<IStageDocument> {
  getStage(_id: string): Promise<IStageDocument>;
  createStage(doc: IStage): Promise<IStageDocument>;
  removeStage(_id: string): object;
  updateStage(_id: string, doc: IStage): Promise<IStageDocument>;
  updateOrder(orders: IOrderInput[]): Promise<IStageDocument[]>;
  checkCodeDuplication(code: string): string;
}

export const loadStageClass = (models: IModels) => {
  class Stage {
    /*
     * Get a stage
     */
    public static async getStage(_id: string) {
      const stage = await models.Stages.findOne({ _id });

      if (!stage) {
        throw new Error('Stage not found');
      }

      return stage;
    }
    /**
     * Create a stage
     */
    public static async createStage(doc: IStage) {
      if (doc.code) {
        await this.checkCodeDuplication(doc.code);
      }
      return models.Stages.create(doc);
    }

    /**
     * Update Stage
     */
    public static async updateStage(_id: string, doc: IStage) {
      if (doc.code) {
        await this.checkCodeDuplication(doc.code);
      }

      return await models.Stages.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /**
     * Remove a stage
     */
    public static async removeStage(_id: string) {
      const stage = await models.Stages.getStage(_id);

      await removeTasks(models, [_id]);

      if (stage.formId) {
        await sendTRPCMessage({
          pluginName: 'core',
          method: 'mutation',
          module: 'forms',
          action: 'removeForm',
          input: {
            formId: stage.formId,
          },
        });
      }

      return await models.Stages.findOneAndDelete({ _id });
    }

    /*
     * Update given stages orders
     */
    public static async updateOrder(orders: IOrderInput[]) {
      return updateOrder(models.Stages, orders);
    }

    /**
     * Check code duplication
     */
    static async checkCodeDuplication(code: string) {
      const stage = await models.Stages.findOne({
        code,
      });

      if (stage) {
        throw new Error('Code must be unique');
      }
    }
  }

  stageSchema.loadClass(Stage);

  return stageSchema;
};
