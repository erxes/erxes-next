import { IContext } from '~/connectionResolvers';

export const boardQueries = {
  /**
   *  Boards list
   */
  async tasksBoards(_root, _args, { models }: IContext) {
    return await models.Boards.find({}).lean();
  },

  /**
   *  Boards count
   */
  async tasksBoardCounts(_root, _args, { models }: IContext) {
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
  async tasksBoardGetLast(_root, _args, { models }: IContext) {
    return models.Boards.findOne({})
      .sort({
        createdAt: -1,
      })
      .lean();
  },

  /**
   *  Board detail
   */
  async tasksBoardDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Boards.findOne({ _id }).lean();
  },
};
