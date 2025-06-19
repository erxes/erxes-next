import { IOrderInput } from 'erxes-api-shared/core-types';
import { sendTRPCMessage, updateOrder } from 'erxes-api-shared/utils';
import { DeleteResult, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IStage, IStageDocument } from '~/modules/tickets/@types/stage';
import { stageSchema } from '~/modules/tickets/db/definitions/stages';

export interface IStageModel extends Model<IStageDocument> {
  getStage(_id: string): Promise<IStageDocument>;
  createStage(doc: IStage): Promise<IStageDocument>;
  removeStage(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  updateStage(_id: string, doc: IStage): Promise<IStageDocument>;
  updateOrder(orders: IOrderInput[]): Promise<IStageDocument[]>;
  checkCodeDuplication(code: string): Promise<void>;
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

    static async checkCodeDuplication(code: string) {
      const stage = await models.Stages.findOne({
        code,
      });

      if (stage) {
        throw new Error('Code must be unique');
      }
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

      await models.Stages.updateOne({ _id }, { $set: doc });

      return models.Stages.findOne({ _id });
    }

    /*
     * Update given stages orders
     */
    public static async updateOrder(orders: IOrderInput[]) {
      return updateOrder(models.Stages, orders);
    }

    /**
     * Remove Stage
     */
    public static async removeStage(_id: string) {
      const stage = await models.Stages.getStage(_id);

      const ticketIds = await models.Tickets.find({
        stageId: { $eq: _id },
      }).distinct('_id');

      await models.CheckLists.removeChecklists(ticketIds);

      await models.Tickets.deleteMany({ stageId: { $in: ticketIds } });

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

      return await models.Stages.deleteOne({ _id });
    }
  }

  stageSchema.loadClass(Stage);

  return stageSchema;
};
