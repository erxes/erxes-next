import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IBoard } from '~/modules/tickets/@types/board';

export const boardMutations = {
  /**
   * Create new board
   */
  async ticketsBoardsAdd(_root: undefined, doc: IBoard, { models }: IContext) {
    return await models.Boards.createBoard(doc);
  },

  /**
   * Edit board
   */
  async ticketsBoardsEdit(
    _root: undefined,
    { _id, ...doc }: IBoard & { _id: string },
    { models }: IContext,
  ) {
    return await models.Boards.updateBoard(_id, doc);
  },

  /**
   * Remove board
   */
  async ticketsBoardsRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const board = await models.Boards.getBoard(_id);

    const relatedFieldsGroups = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'fieldsGroups',
      action: 'find',
      input: {
        query: {
          boardIds: board._id,
        },
      },
      defaultValue: [],
    });

    for (const fieldGroup of relatedFieldsGroups) {
      const boardIds = fieldGroup.boardIds || [];
      fieldGroup.boardIds = boardIds.filter((e) => e !== board._id);

      await sendTRPCMessage({
        pluginName: 'core',
        method: 'mutation',
        module: 'fieldsGroups',
        action: 'updateGroup',
        input: { groupId: fieldGroup._id, fieldGroup },
        defaultValue: [],
      });
    }

    return await models.Boards.removeBoard(_id);
  },

  async ticketsBoardItemUpdateTimeTracking(
    _root: undefined,
    {
      _id,
      status,
      timeSpent,
      startDate,
    }: {
      _id: string;
      status: string;
      timeSpent: number;
      startDate: string;
    },
    { models }: IContext,
  ) {
    return models.Boards.updateTimeTracking(_id, status, timeSpent, startDate);
  },

  async ticketsBoardItemsSaveForGanttTimeline(
    _root: undefined,
    { items, links }: { items: any[]; links: any[] },
    { models }: IContext,
  ) {
    const bulkOps: any[] = [];

    for (const item of items) {
      bulkOps.push({
        updateOne: {
          filter: {
            _id: item._id,
          },
          update: {
            $set: {
              startDate: item.startDate,
              closeDate: item.closeDate,
              relations: links.filter((link) => link.start === item._id),
            },
          },
        },
      });
    }

    await models.Tickets.bulkWrite(bulkOps);

    return 'Success';
  },
};
