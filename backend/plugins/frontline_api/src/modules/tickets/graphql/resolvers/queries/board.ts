import { IUserDocument } from 'erxes-api-shared/core-types';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const boardQueries = {
  /**
   *  Boards list
   */
  async ticketsBoards(
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Boards.find({}).lean();
  },

  /**
   *  Boards count
   */
  async ticketsBoardCounts(
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) {
    const boards = await models.Boards.find({})
      .sort({
        name: 1,
      })
      .lean();

    const counts: Array<{ _id: string; name: string; count: number }> = [];

    let allCount = 0;

    for (const board of boards) {
      const count = await models.Pipelines.find({
        boardId: board._id,
      }).countDocuments();

      counts.push({
        _id: board._id,
        name: board.name || '',
        count,
      });

      allCount += count;
    }

    counts.unshift({ _id: '', name: 'All', count: allCount });

    return counts;
  },

  /**
   * Get last board
   */
  async ticketsBoardGetLast(
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Boards.findOne({})
      .sort({
        createdAt: -1,
      })
      .lean();
  },

  /**
   *  Board detail
   */
  async ticketsBoardDetail(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Boards.getBoard(_id);
  },

  async ticketsBoardContentTypeDetail(
    _root: undefined,
    args: { contentType: string; contentId: string; content: any },
    { models }: IContext,
  ) {
    const { contentType = '', contentId, content } = args;

    switch (contentType.split(':')[1]) {
      case 'checklist':
        return await models.CheckLists.findOne({ _id: content._id });
      case 'checklistitem':
        return await models.CheckListItems.findOne({ _id: content._id });
      case 'ticket':
        return await models.Tickets.getTicket(contentId);
      default:
    }
  },

  async ticketsBoardLogs(
    _root: undefined,
    args: { action: string; content: any; contentId: string },
    { models }: IContext,
  ) {
    const { action, content, contentId } = args;

    if (action === 'moved') {
      const ticket = await models.Tickets.getTicket(contentId);

      const { oldStageId, destinationStageId } = content;

      const destinationStage = await models.Stages.findOne({
        _id: destinationStageId,
      }).lean();

      const oldStage = await models.Stages.findOne({ _id: oldStageId }).lean();

      if (destinationStage && oldStage) {
        return {
          destinationStage: destinationStage.name,
          oldStage: oldStage.name,
          ticket,
        };
      }

      return {
        text: content.text,
      };
    }

    if (action === 'assignee') {
      let addedUsers: IUserDocument[] = [];
      let removedUsers: IUserDocument[] = [];

      if (content) {
        addedUsers = await sendTRPCMessage({
          pluginName: 'core',
          method: 'query',
          module: 'users',
          action: 'find',
          input: {
            query: {
              _id: { $in: content.addedUserIds },
            },
          },
          defaultValue: [],
        });

        removedUsers = await sendTRPCMessage({
          pluginName: 'core',
          method: 'query',
          module: 'users',
          action: 'find',
          input: {
            query: {
              _id: { $in: content.removedUserIds },
            },
          },
          defaultValue: [],
        });
      }

      return { addedUsers, removedUsers };
    }
  },
};
