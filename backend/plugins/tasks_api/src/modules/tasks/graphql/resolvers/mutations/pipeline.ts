import { IOrderInput } from "erxes-api-shared/core-types";
import { sendTRPCMessage } from "erxes-api-shared/utils/trpc";
import { IContext } from "~/connectionResolvers";
import { IPipeline, IPipelineDocument } from "~/modules/tasks/@types/pipeline";
import { IStageDocument } from "~/modules/tasks/@types/stage";
import { checkNumberConfig } from "~/modules/tasks/utils";



export const pipelineMutations = {
    /**
     * Create new pipeline
     */
    async tasksPipelinesAdd(
      _root,
      { stages, ...doc }: IPipeline & { stages: IStageDocument[] },
      { user, models }: IContext,
    ) {
      if (doc.numberConfig || doc.numberSize) {
        await checkNumberConfig(doc.numberConfig || '', doc.numberSize || '');
      }
  
      // await sendCoreMessage({
      //   subdomain,
      //   action: "registerOnboardHistory",
      //   data: {
      //     type: `${doc.type}PipelineConfigured`,
      //     user
      //   }
      // });
  
      return await models.Pipelines.createPipeline(
        { userId: user._id, ...doc },
        stages,
      );
    },
  
    /**
     * Edit pipeline
     */
    async tasksPipelinesEdit(
      _root,
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
    async tasksPipelinesUpdateOrder(
      _root,
      { orders }: { orders: IOrderInput[] },
      { models }: IContext,
    ) {
      return models.Pipelines.updateOrder(orders);
    },
  
    /**
     * Watch pipeline
     */
    async tasksPipelinesWatch(
      _root,
      { _id, isAdd }: { _id: string; isAdd: boolean },
      { user, models }: IContext,
    ) {
      return models.Pipelines.watchPipeline(_id, isAdd, user._id);
    },
  
    /**
     * Remove pipeline
     */
    async tasksPipelinesRemove(
      _root,
      { _id }: { _id: string },
      { models }: IContext,
    ) {
      const pipeline = await models.Pipelines.getPipeline(_id);
  
      const relatedFieldsGroups = await sendTRPCMessage({
        pluginName: 'getpipeline',
        method: 'query',
        module: '',
        action: '',
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
          pluginName: '',
          method: 'query',
          module: '', // ??
          action: '',
          input: {
            groupId: fieldGroup._id,
            fieldGroup,
          },
        });
      }
  
      return await models.Pipelines.removePipeline(_id);
    },
  
    /**
     * Archive pipeline
     */
    async tasksPipelinesArchive(
      _root,
      { _id, status }: { _id: string; status: string },
      { models }: IContext,
    ) {
      return await models.Pipelines.archivePipeline(_id, status);
    },
  
    /**
     * Duplicate pipeline
     */
    async tasksPipelinesCopied(
      _root,
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
  