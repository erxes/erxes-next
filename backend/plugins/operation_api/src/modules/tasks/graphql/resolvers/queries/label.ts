import { IContext } from '~/connectionResolvers';

export const pipelineLabelQueries = {
  /**
   *  Pipeline label list
   */
  async tasksPipelineLabels(
    _root,
    { pipelineId, pipelineIds }: { pipelineId: string; pipelineIds: string[] },
    { models }: IContext,
  ) {
    const filter: any = {};

    filter.pipelineId = pipelineId;

    if (pipelineIds) {
      filter.pipelineId = { $in: pipelineIds };
    }

    return models.PipelineLabels.find(filter);
  },

  /**
   *  Pipeline label detail
   */
  async tasksPipelineLabelDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.PipelineLabels.findOne({ _id });
  },
};
