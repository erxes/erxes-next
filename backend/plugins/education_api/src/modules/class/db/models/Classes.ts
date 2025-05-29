import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IClass, IClassDocument } from '~/modules/class/@types/classes';
import { classSchema } from '~/modules/class/db/definitions/class';

export interface IClassModel extends Model<IClassDocument> {
  createClass(doc: IClass): Promise<IClassDocument>;
  getClass(_id: string): Promise<IClassDocument>;
  updateClass(_id: string, doc: IClass): Promise<IClassDocument>;
  removeClasses(classIds: string[]): Promise<IClassDocument>;
}

export const loadClassesClass = (models: IModels) => {
  class Class {
    public static async getClass(_id: string) {
      const courseClass = await models.Classes.findOne({ _id });

      if (!courseClass) {
        throw new Error('Class not found');
      }

      return courseClass;
    }

    public static async createClass(doc) {
      return await models.Classes.create({
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    public static async updateClass(_id, doc) {
      await models.Classes.updateOne(
        { _id },
        { $set: { ...doc, updatedAt: new Date() } },
      );

      return models.Classes.findOne({ _id });
    }

    public static async removeClasses(classIds) {
      return models.Classes.deleteMany({ _id: { $in: classIds } });
    }
  }
  classSchema.loadClass(Class);

  return classSchema;
};
