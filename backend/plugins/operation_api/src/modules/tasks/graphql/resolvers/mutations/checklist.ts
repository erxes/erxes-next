import { graphqlPubsub } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IChecklist, IChecklistItem } from '~/modules/tasks/@types/checklists';

const checklistsChanged = (checklist: IChecklist & { _id: string }) => {
  graphqlPubsub.publish(
    `tasksChecklistsChanged:${checklist.contentType}:${checklist.contentTypeId}`,
    {
      tasksChecklistsChanged: {
        _id: checklist._id,
        contentType: checklist.contentType,
        contentTypeId: checklist.contentTypeId,
      },
    },
  );
};

const tasksChecklistDetailChanged = (_id: string) => {
  graphqlPubsub.publish(`tasksChecklistDetailChanged:${_id}`, {
    tasksChecklistDetailChanged: {
      _id,
    },
  });
};

export const checklistMutations = {
  /**
   * Adds checklist object and also adds an activity log
   */
  async tasksChecklistsAdd(
    _root,
    args: IChecklist,
    { models, user }: IContext,
  ) {
    const checklist = await models.Checklists.createChecklist(args, user);

    checklistsChanged(checklist);

    return checklist;
  },

  /**
   * Updates checklist object
   */
  async tasksChecklistsEdit(
    _root,
    { _id, ...doc }: IChecklist & { _id: string },
    { models }: IContext,
  ) {
    const updated = await models.Checklists.updateChecklist(_id, doc);

    tasksChecklistDetailChanged(_id);

    return updated;
  },

  /**
   * Removes a checklist
   */
  async tasksChecklistsRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const checklist = await models.Checklists.getChecklist(_id);
    const removed = await models.Checklists.removeChecklists([_id]);

    checklistsChanged(checklist);

    return removed;
  },

  /**
   * Adds a checklist item and also adds an activity log
   */
  async tasksChecklistItemsAdd(
    _root,
    args: IChecklistItem,
    { user, models }: IContext,
  ) {
    const checklistItem = await models.ChecklistItems.createChecklistItem(
      args,
      user,
    );

    tasksChecklistDetailChanged(checklistItem.checklistId);

    return checklistItem;
  },

  /**
   * Updates a checklist item
   */
  async tasksChecklistItemsEdit(
    _root,
    { _id, ...doc }: IChecklistItem & { _id: string },
    { models }: IContext,
  ) {
    const updated = await models.ChecklistItems.updateChecklistItem(_id, doc);

    tasksChecklistDetailChanged(updated.checklistId);

    return updated;
  },

  /**
   * Removes a checklist item
   */
  async tasksChecklistItemsRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const checklistItem = await models.ChecklistItems.getChecklistItem(_id);
    const removed = await models.ChecklistItems.removeChecklistItem(_id);

    tasksChecklistDetailChanged(checklistItem.checklistId);

    return removed;
  },

  async tasksChecklistItemsOrder(
    _root,
    { _id, destinationIndex }: { _id: string; destinationIndex: number },
    { models }: IContext,
  ) {
    return models.ChecklistItems.updateItemOrder(_id, destinationIndex);
  },
};
