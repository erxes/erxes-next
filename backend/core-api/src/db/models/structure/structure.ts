import { IStructureDocument } from 'backend/core-api/src/modules/structure/types';
import { structureSchema } from '../../definitions/structure/structure';
import { Model } from 'mongoose';
import { IModels } from 'backend/core-api/src/connectionResolvers';

export interface IStructureModel extends Model<IStructureDocument> {
  getStructure(doc: any): IStructureDocument;
  createStructure(doc: any, user: any): IStructureDocument;
  updateStructure(_id: string, doc: any, user: any): IStructureDocument;
  removeStructure(_id: string): IStructureDocument;
}

export const loadStructureClass = (models: IModels) => {
  class Structure {
    /*
     * Get a structure
     */
    public static async getStructure(doc: any) {
      const structure = await models.Structures.findOne(doc);

      if (!structure) {
        throw new Error('Structure not found');
      }

      return structure;
    }

    /*
     * Create an structure
     */
    public static async createStructure(doc: any, user: any) {
      const structure = await models.Structures.create({
        ...doc,
        createdAt: new Date(),
        createdBy: user._id,
      });

      return structure;
    }

    /*
     * Update an structure
     */
    public static async updateStructure(_id: string, doc: any, user: any) {
      await models.Structures.updateOne(
        { _id },
        {
          ...doc,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      );

      return models.Structures.findOne({ _id });
    }

    /*
     * Remove a structure
     */
    public static async removeStructure(_id: string) {
      const structure = await models.Structures.getStructure({ _id });
      await structure.deleteOne();
      return structure;
    }
  }

  structureSchema.loadClass(Structure);

  return structureSchema;
};
