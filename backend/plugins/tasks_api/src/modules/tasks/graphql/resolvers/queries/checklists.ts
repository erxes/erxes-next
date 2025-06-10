import { moduleRequireLogin } from "erxes-api-shared/core-modules/permissions/utils";
import { IContext } from "~/connectionResolvers";



const checklistQueries = {
  /**
   * Checklists list
   */
  async tasksChecklists(
    _root,
    {
      contentType,
      contentTypeId
    }: { contentType: string; contentTypeId: string },
    { models: { Checklists } }: IContext
  ) {
    return Checklists.find({ contentType, contentTypeId }).sort({
      createdDate: 1,
      order: 1
    });
  },

  /**
   * Checklist
   */
  async tasksChecklistDetail(
    _root,
    { _id }: { _id: string },
    { models: { Checklists } },
  ) {
    return Checklists.findOne({ _id }).sort({ order: 1 });
  }
};

moduleRequireLogin(checklistQueries);

export default checklistQueries;