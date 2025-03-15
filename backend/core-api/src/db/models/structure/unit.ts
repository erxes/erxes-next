import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IUnitDocument } from 'backend/core-api/src/modules/structure/types';
import { Model } from 'mongoose';
import { unitSchema } from '../../definitions/structure/unit';

export interface IUnitModel extends Model<IUnitDocument> {
  getUnit(doc: any): IUnitDocument;
  createUnit(doc: any, user: any): IUnitDocument;
  updateUnit(_id: string, doc: any, user: any): IUnitDocument;
  removeUnits(ids?: string[]): IUnitDocument;
}

export const loadUnitClass = (models: IModels) => {
  class Unit {
    /*
     * Get an unit
     */
    public static async getUnit(doc: any) {
      const unit = await models.Units.findOne(doc);

      if (!unit) {
        throw new Error('Unit not found');
      }

      return unit;
    }

    /*
     * Create an unit
     */
    public static async createUnit(doc: any, user: any) {
      const unit = await models.Units.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      return unit;
    }

    /*
     * Update an unit
     */
    public static async updateUnit(_id: string, doc: any, user: any) {
      await models.Units.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Units.findOne({ _id });
    }

    /*
     * Remove an unit
     */
    public static async removeUnits(ids: string) {
      const units = await models.Units.find({ _id: { $in: ids } });

      const unitIds = units.map((unit) => unit._id);

      return await models.Units.deleteMany({ _id: { $in: unitIds } });
    }
  }

  unitSchema.loadClass(Unit);

  return unitSchema;
};
