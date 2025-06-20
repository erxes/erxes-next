import { IOrderInput } from 'erxes-api-shared/core-types';
import { updateOrder } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  IPipeline,
  IPipelineDocument,
} from '~/modules/tickets/@types/pipeline';
import { IStage, IStageDocument } from '~/modules/tickets/@types/stage';
import { TICKET_STATUSES } from '~/modules/tickets/constants';
import { pipelineSchema } from '~/modules/tickets/db/definitions/pipelines';
import {
  createOrUpdatePipelineStages,
  generateLastNum,
} from '~/modules/tickets/utils';

export interface IPipelineModel extends Model<IPipelineDocument> {
  getPipeline(_id: string): Promise<IPipelineDocument>;
  createPipeline(doc: IPipeline, stages?: IStage[]): Promise<IPipelineDocument>;
  updatePipeline(
    _id: string,
    doc: IPipeline,
    stages?: IStage[],
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

      return models.Pipelines.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
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
        const stageIds = await models.Stages.find({
          pipelineId: pipeline._id,
        }).distinct('_id');

        const ticketIds = await models.Tickets.find({
          stageId: { $in: stageIds },
        }).distinct('_id');

        await models.CheckLists.removeChecklists(ticketIds);
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
        pipeline.status === TICKET_STATUSES.ACTIVE
          ? TICKET_STATUSES.ARCHIVED
          : TICKET_STATUSES.ACTIVE;

      await models.Pipelines.updateOne({ _id }, { $set: { status } });
    }

    public static async watchPipeline(
      _id: string,
      isAdd: boolean,
      userId: string,
    ) {
      const pipeline = await models.Pipelines.getPipeline(_id);

      const watchedUserIds = pipeline.watchedUserIds || [];

      if (isAdd) {
        watchedUserIds.push(userId);
      } else {
        const index = watchedUserIds.indexOf(userId);

        watchedUserIds.splice(index, 1);
      }

      return await models.Pipelines.updateOne(
        { _id },
        { $set: { watchedUserIds } },
        { new: true },
      );
    }
  }

  pipelineSchema.loadClass(Pipeline);

  return pipelineSchema;
};
