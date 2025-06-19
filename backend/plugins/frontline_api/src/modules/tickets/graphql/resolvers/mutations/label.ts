import { IContext } from '~/connectionResolvers';
import { IPipelineLabel } from '~/modules/tickets/@types/label';

export const pipelineLabelMutations = {
  /**
   * Creates a new pipeline label
   */
  async ticketsPipelineLabelsAdd(
    _root: undefined,
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
  async ticketsPipelineLabelsEdit(
    _root: undefined,
    { _id, ...doc }: IPipelineLabel & { _id: string },
    { models }: IContext,
  ) {
    return await models.PipelineLabels.updatePipelineLabel(_id, doc);
  },

  /**
   * Remove pipeline label
   */
  async ticketsPipelineLabelsRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.PipelineLabels.removePipelineLabel(_id);
  },

  /**
   * Attach a label
   */
  async ticketsPipelineLabelsLabel(
    _root: undefined,
    {
      pipelineId,
      targetId,
      labelIds,
    }: { pipelineId: string; targetId: string; labelIds: string[] },
    { models }: IContext,
  ) {
    return models.PipelineLabels.labelsLabel(pipelineId, targetId, labelIds);
  },
};
