import { positionSchema } from '../../definitions/structure/position';
import { checkCodeDuplication, escapeRegExp } from 'erxes-api-utils';
import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IPositionDocument } from 'backend/core-api/src/modules/structure/types';
import { Model } from 'mongoose';

export interface IPositionModel extends Model<IPositionDocument> {
  getPosition(doc: any): IPositionDocument;
  createPosition(doc: any, user: any): IPositionDocument;
  updatePosition(_id: string, doc: any, user: any): IPositionDocument;
  removePositions(ids?: string[]): IPositionDocument;
}

export const loadPositionClass = (models: IModels) => {
  class Position {
    /*
     * Get a position
     */
    public static async getPosition(doc: any) {
      const position = await models.Positions.findOne(doc);

      if (!position) {
        throw new Error('Position not found');
      }

      return position;
    }

    /*
     * Create a position
     */
    public static async createPosition(doc: any, user: any) {
      await checkCodeDuplication(models.Positions, doc.code);

      const parent = await models.Positions.findOne({
        _id: doc.parentId,
      }).lean();

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const position = await models.Positions.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      return position;
    }

    /*
     * Update a position
     */
    public static async updatePosition(_id: string, doc: any, user: any) {
      const position = await models.Positions.getPosition({ _id });

      if (position?.code !== doc.code) {
        await checkCodeDuplication(models.Positions, doc.code);
      }

      const parent = await models.Positions.findOne({ _id: doc.parentId });

      if (parent && parent?.parentId === _id) {
        throw new Error('Cannot change a position');
      }

      doc.order = parent ? `${parent.order}${doc.code}/` : `${doc.code}/`;

      const children = await models.Positions.find({
        order: { $regex: new RegExp(`^${escapeRegExp(position.order)}`) },
      });

      for (const child of children) {
        let order = child.order;

        order = order.replace(position.order, doc.order);

        await models.Positions.updateOne(
          {
            _id: child._id,
          },
          {
            $set: { order },
          },
        );
      }

      await models.Positions.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Positions.findOne({ _id });
    }

    /*
     * Remove a branch
     */

    public static async removePositions(ids: string[]) {
      const positions = await models.Positions.find({ _id: { $in: ids } });

      const positionIds = positions.map((branch) => branch._id);

      return await models.Positions.deleteMany({
        $or: [
          { _id: { $in: positionIds } },
          { parentId: { $in: positionIds } },
        ],
      });
    }
  }

  positionSchema.loadClass(Position);

  return positionSchema;
};
