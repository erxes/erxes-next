import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IBoard } from '~/modules/tasks/@types/boards';

export const boardMutations = {
  /**
   * Create new board
   */
  async tasksBoardsAdd(_root, doc: IBoard, { models }: IContext) {
    return await models.Boards.createBoard(doc);
  },

  /**
   * Edit board
   */
  async tasksBoardsEdit(
    _root,
    { _id, ...doc }: IBoard & { _id: string },
    { models }: IContext,
  ) {
    return await models.Boards.updateBoard(_id, doc);
  },

  /**
   * Remove board
   */
  async tasksBoardsRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const board = await models.Boards.getBoard(_id);

    const removed = await models.Boards.removeBoard(_id);

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
        input: {
          groupId: fieldGroup._id,
          fieldGroup,
        },
      });
    }

    return removed;
  },
};
