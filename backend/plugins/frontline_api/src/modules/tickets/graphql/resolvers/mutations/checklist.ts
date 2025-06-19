import { graphqlPubsub } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IChecklist, IChecklistItem } from '~/modules/tickets/@types/checklist';

const checklistsChanged = (checklist: IChecklist & { _id: string }) => {
  graphqlPubsub.publish(
    `ticketsChecklistsChanged:${checklist.contentType}:${checklist.contentTypeId}`,
    {
      ticketsChecklistsChanged: {
        _id: checklist._id,
        contentType: checklist.contentType,
        contentTypeId: checklist.contentTypeId,
      },
    },
  );
};

const ticketsChecklistDetailChanged = (_id: string) => {
  graphqlPubsub.publish(`ticketsChecklistDetailChanged:${_id}`, {
    ticketsChecklistDetailChanged: {
      _id,
    },
  });
};

export const checklistMutations = {
  /**
   * Adds checklist object and also adds an activity log
   */
  async ticketsChecklistsAdd(
    _root: undefined,
    args: IChecklist,
    { models, user }: IContext,
  ) {
    const checklist = await models.CheckLists.createChecklist(args, user);

    checklistsChanged(checklist);

    return checklist;
  },

  /**
   * Updates checklist object
   */
  async ticketsChecklistsEdit(
    _root: undefined,
    { _id, ...doc }: IChecklist & { _id: string },
    { models }: IContext,
  ) {
    const updated = await models.CheckLists.updateChecklist(_id, doc);

    ticketsChecklistDetailChanged(_id);

    return updated;
  },

  /**
   * Removes a checklist
   */
  async ticketsChecklistsRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const checklist = await models.CheckLists.getChecklist(_id);
    const removed = await models.CheckLists.removeChecklist(_id);

    checklistsChanged(checklist);

    return removed;
  },

  /**
   * Adds a checklist item and also adds an activity log
   */
  async ticketsChecklistItemsAdd(
    _root: undefined,
    args: IChecklistItem,
    { user, models }: IContext,
  ) {
    const checklistItem = await models.CheckListItems.createChecklistItem(
      args,
      user,
    );

    ticketsChecklistDetailChanged(checklistItem.checklistId);

    return checklistItem;
  },

  /**
   * Updates a checklist item
   */
  async ticketsChecklistItemsEdit(
    _root: undefined,
    { _id, ...doc }: IChecklistItem & { _id: string },
    { models }: IContext,
  ) {
    const updated = await models.CheckListItems.updateChecklistItem(_id, doc);

    ticketsChecklistDetailChanged(updated.checklistId);

    return updated;
  },

  /**
   * Removes a checklist item
   */
  async ticketsChecklistItemsRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const checklistItem = await models.CheckListItems.getChecklistItem(_id);
    const removed = await models.CheckListItems.removeChecklistItem(_id);

    ticketsChecklistDetailChanged(checklistItem.checklistId);

    return removed;
  },

  async ticketsChecklistItemsOrder(
    _root: undefined,
    { _id, destinationIndex }: { _id: string; destinationIndex: number },
    { models }: IContext,
  ) {
    return models.CheckListItems.updateItemOrder(_id, destinationIndex);
  },
};
