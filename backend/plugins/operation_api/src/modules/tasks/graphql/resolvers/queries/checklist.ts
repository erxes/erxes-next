import { IContext } from '~/connectionResolvers';

export const checklistQueries = {
  /**
   * Checklists list
   */
  async tasksChecklists(
    _root,
    {
      contentType,
      contentTypeId,
    }: { contentType: string; contentTypeId: string },
    { models }: IContext,
  ) {
    return models.Checklists.find({ contentType, contentTypeId }).sort({
      createdDate: 1,
      order: 1,
    });
  },

  /**
   * Checklist
   */
  async tasksChecklistDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Checklists.findOne({ _id }).sort({ order: 1 });
  },
};
