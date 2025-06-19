import { IOrderInput } from 'erxes-api-shared/core-types';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  IPipeline,
  IPipelineDocument,
} from '~/modules/tickets/@types/pipeline';
import { IStageDocument } from '~/modules/tickets/@types/stage';
import { checkNumberConfig } from '~/modules/tickets/utils';

export const pipelineMutations = {
  /**
   * Create new pipeline
   */
  async ticketsPipelinesAdd(
    _root: undefined,
    { stages, ...doc }: IPipeline & { stages: IStageDocument[] },
    { user, models }: IContext,
  ) {
    if (doc.numberConfig || doc.numberSize) {
      await checkNumberConfig(doc.numberConfig || '', doc.numberSize || '');
    }

    return await models.Pipelines.createPipeline(
      { userId: user._id, ...doc },
      stages,
    );
  },

  /**
   * Edit pipeline
   */
  async ticketsPipelinesEdit(
    _root: undefined,
    { _id, stages, ...doc }: IPipelineDocument & { stages: IStageDocument[] },
    { models }: IContext,
  ) {
    if (doc.numberConfig || doc.numberSize) {
      await checkNumberConfig(doc.numberConfig || '', doc.numberSize || '');
    }

    return await models.Pipelines.updatePipeline(_id, doc, stages);
  },

  /**
   * Update pipeline orders
   */
  async ticketsPipelinesUpdateOrder(
    _root: undefined,
    { orders }: { orders: IOrderInput[] },
    { models }: IContext,
  ) {
    return models.Pipelines.updateOrder(orders);
  },

  /**
   * Watch pipeline
   */
  async ticketsPipelinesWatch(
    _root: undefined,
    { _id, isAdd }: { _id: string; isAdd: boolean },
    { user, models }: IContext,
  ) {
    return models.Pipelines.watchPipeline(_id, isAdd, user._id);
  },

  /**
   * Remove pipeline
   */
  async ticketsPipelinesRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const pipeline = await models.Pipelines.getPipeline(_id);

    const removed = await models.Pipelines.removePipeline(_id);

    const relatedFieldsGroups = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'fieldsGroups',
      action: 'find',
      input: {
        query: {
          pipelineIds: pipeline._id,
        },
      },
      defaultValue: [],
    });

    for (const fieldGroup of relatedFieldsGroups) {
      const pipelineIds = fieldGroup.pipelineIds || [];
      fieldGroup.pipelineIds = pipelineIds.filter((e) => e !== pipeline._id);

      await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'fieldsGroups',
        action: 'updateGroup',
        input: {
          groupId: fieldGroup._id,
          fieldGroup,
        },
      });
    }

    return removed;
  },

  /**
   * Archive pipeline
   */
  async ticketsPipelinesArchive(
    _root: undefined,
    { _id, status }: { _id; status: string },
    { models }: IContext,
  ) {
    return await models.Pipelines.archivePipeline(_id, status);
  },

  /**
   * Duplicate pipeline
   */
  async ticketsPipelinesCopied(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const sourcePipeline = await models.Pipelines.getPipeline(_id);
    const sourceStages = await models.Stages.find({ pipelineId: _id }).lean();

    const pipelineDoc = {
      ...sourcePipeline,
      _id: undefined,
      status: sourcePipeline.status || 'active',
      name: `${sourcePipeline.name}-copied`,
    };

    const copied = await models.Pipelines.createPipeline(pipelineDoc);

    for (const stage of sourceStages) {
      const { _id, ...rest } = stage;

      await models.Stages.createStage({
        ...rest,
        probability: stage.probability || '10%',
        type: copied.type,
        pipelineId: copied._id,
      });
    }

    return copied;
  },
};
