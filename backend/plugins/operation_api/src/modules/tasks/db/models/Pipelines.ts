import { IOrderInput } from 'erxes-api-shared/core-types';
import { updateOrder } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IPipeline, IPipelineDocument } from '~/modules/tasks/@types/pipelines';
import { IStageDocument } from '~/modules/tasks/@types/stages';
import { TASK_STATUSES } from '~/modules/tasks/constants';
import { pipelineSchema } from '~/modules/tasks/db/definitions/pipelines';
import {
  createOrUpdatePipelineStages,
  generateLastNum,
  removeStages,
} from '~/modules/tasks/db/models/utils';

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

      await createOrUpdatePipelineStages(models, pipeline._id, stages);

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
      await createOrUpdatePipelineStages(models, _id, stages);

      if (doc.numberSize) {
        const pipeline = await models.Pipelines.getPipeline(_id);

        if (pipeline.numberConfig !== doc.numberConfig) {
          doc.lastNum = await generateLastNum(models, doc);
        }
      }

      return await models.Pipelines.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /**
     * Remove a pipeline
     */
    public static async removePipeline(_id: string, checked?: boolean) {
      const pipeline = await models.Pipelines.getPipeline(_id);

      if (!checked) {
        await removeStages(models, [pipeline._id]);
      }

      return await models.Pipelines.findOneAndDelete({ _id });
    }

    /*
     * Update given pipelines orders
     */
    public static async updateOrder(orders: IOrderInput[]) {
      return updateOrder(models.Pipelines, orders);
    }

    /**
     * Archive a pipeline
     */
    public static async archivePipeline(_id: string) {
      const pipeline = await models.Pipelines.getPipeline(_id);

      const status =
        pipeline.status === TASK_STATUSES.ACTIVE
          ? TASK_STATUSES.ARCHIVED
          : TASK_STATUSES.ACTIVE;

      return await models.Pipelines.findOneAndUpdate(
        { _id },
        { $set: { status } },
        { new: true },
      );
    }

    /**
     * Watch a pipeline
     */
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

      return await models.Pipelines.findOneAndUpdate(
        { _id },
        { $set: { watchedUserIds } },
        { new: true },
      );
    }
  }

  pipelineSchema.loadClass(Pipeline);

  return pipelineSchema;
};
