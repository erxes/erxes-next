import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IBoard, IBoardDocument } from '~/modules/tickets/@types/board';
import { boardSchema } from '~/modules/tickets/db/definitions/boards';

export interface IBoardModel extends Model<IBoardDocument> {
  getBoard(_id: string): Promise<IBoardDocument>;
  createBoard(doc: IBoard): Promise<IBoardDocument>;
  updateBoard(_id: string, doc: IBoard): Promise<IBoardDocument>;
  removeBoard(_id: string): object;
}

export const loadBoardClass = (models: IModels) => {
  class Board {
    /*
     * Get a Board
     */
    public static async getBoard(_id: string) {
      const board = await models.Boards.findOne({ _id }).lean();

      if (!board) {
        throw new Error('Board not found');
      }

      return board;
    }

    /**
     * Create a board
     */
    public static async createBoard(doc: IBoard) {
      return models.Boards.create(doc);
    }

    /**
     * Update Board
     */
    public static async updateBoard(_id: string, doc: IBoard) {
      await models.Boards.updateOne({ _id }, { $set: doc });

      return models.Boards.findOne({ _id });
    }

    /**
     * Remove Board
     */
    public static async removeBoard(_id: string) {
      const board = await models.Boards.findOne({ _id });

      if (!board) {
        throw new Error('Board not found');
      }

      const pipelines = await models.Pipelines.find({ boardId: _id });

      for (const pipeline of pipelines) {
        const { _id: pipelineId } = pipeline || {};

        if (!pipelineId) continue;

        const stageIds = await models.Stages.find({ pipelineId }).distinct(
          '_id',
        );

        if (stageIds.length === 0) continue;

        const ticketIds = await models.Tickets.find({
          stageId: { $in: stageIds },
        }).distinct('_id');

        if (ticketIds.length > 0) {
          await models.CheckLists.removeChecklists(ticketIds);
          await models.Tickets.deleteMany({ _id: { $in: ticketIds } });
        }

        await models.Stages.deleteMany({ _id: { $in: stageIds } });
      }

      for (const pipeline of pipelines) {
        await models.Pipelines.removePipeline(pipeline._id, true);
      }

      return models.Boards.deleteOne({ _id });
    }
  }

  boardSchema.loadClass(Board);

  return boardSchema;
};
