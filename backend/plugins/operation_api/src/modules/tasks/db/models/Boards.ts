import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IBoard, IBoardDocument } from '~/modules/tasks/@types/boards';
import { boardSchema } from '~/modules/tasks/db/definitions/boards';
import { removePipelines } from '~/modules/tasks/db/models/utils';

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
      const board = await models.Boards.findOne({ _id });

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
      return await models.Boards.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /**
     * Remove Board
     */
    public static async removeBoard(_id: string) {
      const board = await models.Boards.getBoard(_id);

      await removePipelines(models, [board._id]);

      return models.Boards.findOneAndDelete({ _id });
    }
  }

  boardSchema.loadClass(Board);

  return boardSchema;
};
