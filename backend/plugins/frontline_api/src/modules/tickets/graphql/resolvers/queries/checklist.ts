import { IContext } from '~/connectionResolvers';

export const checklistQueries = {
  /**
   * Checklists list
   */
  async ticketsChecklists(
    _root: undefined,
    { contentTypeId }: { contentTypeId: string },
    { models }: IContext,
  ) {
    return models.CheckLists.find({ contentTypeId }).sort({
      createdDate: 1,
      order: 1,
    });
  },

  /**
   * Checklist
   */
  async ticketsChecklistDetail(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.CheckLists.findOne({ _id }).sort({ order: 1 });
  },
};
