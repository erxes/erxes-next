import { IContext } from '~/connectionResolvers';
import { IPipelineLabel } from '~/modules/tasks/@types/labels';

export const pipelineLabelMutations = {
  /**
   * Creates a new pipeline label
   */
  async tasksPipelineLabelsAdd(
    _root,
    { ...doc }: IPipelineLabel,
    { user, models }: IContext,
  ) {
    return await models.PipelineLabels.createPipelineLabel({
      createdBy: user._id,
      ...doc,
    });
  },

  /**
   * Edit pipeline label
   */
  async tasksPipelineLabelsEdit(
    _root,
    { _id, ...doc }: IPipelineLabel & { _id: string },
    { models }: IContext,
  ) {
    return await models.PipelineLabels.updatePipelineLabel(_id, doc);
  },

  /**
   * Remove pipeline label
   */
  async tasksPipelineLabelsRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.PipelineLabels.removePipelineLabel(_id);
  },

  /**
   * Attach a label
   */
  async tasksPipelineLabelsLabel(
    _root,
    { targetId, labelIds }: { targetId: string; labelIds: string[] },
    { models }: IContext,
  ) {
    return models.PipelineLabels.labelsLabel(targetId, labelIds);
  },
};
