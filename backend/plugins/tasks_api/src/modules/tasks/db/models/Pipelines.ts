import { IOrderInput } from 'erxes-api-shared/core-types';
import { updateOrder } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  createOrUpdatePipelineStages,
  generateLastNum,
  removePipelineStagesWithItems,
  watchItem,
} from '../../utils';
import { pipelineSchema } from '../definitions/pipelines';
import { IPipeline, IPipelineDocument } from '../../@types/pipeline';
import { IStageDocument } from '../../@types/stage';
import { BOARD_STATUSES } from '../../constants';


export interface IPipelineModel extends Model<IPipelineDocument> {
  getPipeline(_id: string): Promise<IPipelineDocument>;
  createPipeline(
    doc: IPipeline,
    stages?: IStageDocument[],
  ): Promise<IPipelineDocument>;
  updatePipeline(
    _id: string,
    doc: IPipeline,
    stages?: IStageDocument[],
  ): Promise<IPipelineDocument>;
  updateOrder(orders: IOrderInput[]): Promise<IPipelineDocument[]>;
  watchPipeline(_id: string, isAdd: boolean, userId: string): void;
  removePipeline(_id: string, checked?: boolean): object;
  archivePipeline(_id: string, status?: string): object;
}

export const loadPipelineClass = (models: IModels) => {
  class Pipeline {
    /*
     * Get a pipeline
     */
    public static async getPipeline(_id: string) {
      const pipeline = await models.Pipelines.findOne({ _id }).lean();

      if (!pipeline) {
        throw new Error('Pipeline not found');
      }

      return pipeline;
    }

    /**
     * Create a pipeline
     */
    public static async createPipeline(
      doc: IPipeline,
      stages?: IStageDocument[],
    ) {
      if (doc.numberSize) {
        doc.lastNum = await generateLastNum(models, doc);
      }

      const pipeline = await models.Pipelines.create(doc);

      if (stages) {
        await createOrUpdatePipelineStages(models, stages, pipeline._id);
      }

      return pipeline;
    }

    /**
     * Update a pipeline
     */
    public static async updatePipeline(
      _id: string,
      doc: IPipeline,
      stages?: IStageDocument[],
    ) {
      if (stages) {
        await createOrUpdatePipelineStages(models, stages, _id);
      }

      if (doc.numberSize) {
        const pipeline = await models.Pipelines.getPipeline(_id);

        if (pipeline.numberConfig !== doc.numberConfig) {
          doc.lastNum = await generateLastNum(models, doc);
        }
      }

      await models.Pipelines.updateOne({ _id }, { $set: doc });

      return models.Pipelines.findOne({ _id });
    }

    /*
     * Update given pipelines orders
     */
    public static async updateOrder(orders: IOrderInput[]) {
      return updateOrder(models.Pipelines, orders);
    }

    /**
     * Remove a pipeline
     */
    public static async removePipeline(_id: string, checked?: boolean) {
      const pipeline = await models.Pipelines.getPipeline(_id);

      if (!checked) {
        await removePipelineStagesWithItems(models, pipeline._id);
      }

      const stages = await models.Stages.find({ pipelineId: pipeline._id });

      for (const stage of stages) {
        await models.Stages.removeStage(stage._id);
      }

      return models.Pipelines.deleteOne({ _id });
    }

    /**
     * Archive a pipeline
     */
    public static async archivePipeline(_id: string) {
      const pipeline = await models.Pipelines.getPipeline(_id);
      const status =
        pipeline.status === BOARD_STATUSES.ACTIVE
          ? BOARD_STATUSES.ARCHIVED
          : BOARD_STATUSES.ACTIVE;

      await models.Pipelines.updateOne({ _id }, { $set: { status } });
    }

    public static watchPipeline(_id: string, isAdd: boolean, userId: string) {
      return watchItem(models.Pipelines, _id, isAdd, userId);
    }
  }

  pipelineSchema.loadClass(Pipeline);

  return pipelineSchema;
};
