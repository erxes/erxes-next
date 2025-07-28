import { Model, FilterQuery } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IBlock, IBlockDocument } from '~/modules/saving/@types/blockTypes';

export interface IBlockModel extends Model<IBlockDocument> {
  getBlock(selector: FilterQuery<IBlockDocument>);
  createBlock(doc: IBlock): Promise<IBlockDocument>;
  removeBlocks(_ids: string[]): Promise<IBlockDocument>;
}

export const laodBlockClass = (models: IModels) => {
  class Block {
    /**
     *
     * Get Block
     */
    public static async getBlock(selector: FilterQuery<IBlockDocument>) {
      const block = await models.Blocks.findOne(selector);

      if (!block) {
        throw new Error('Block not found');
      }

      return block;
    }

    /**
     * Create a block
     */

    public static async createBlock(doc: IBlock) {}
  }
};
