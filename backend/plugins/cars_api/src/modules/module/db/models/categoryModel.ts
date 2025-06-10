import { Model } from 'mongoose';
import { ICarCategory, ICarCategoryDocument } from '../../@types/category';
import { IModels } from '~/connectionResolvers';
import { categorySchema } from '../definitions/category';

export interface ICarCategoryModel extends Model<ICarCategoryDocument> {
  getCarCategory(selector: any): Promise<ICarCategoryDocument>;
  createCarCategory(doc: ICarCategory): Promise<ICarCategoryDocument>;
  getCarCategories(doc: ICarCategory): Promise<ICarCategoryDocument>;
  updateCarCategory(
    _id: string,
    doc: ICarCategory,
  ): Promise<ICarCategoryDocument>;
  removeCarCategory(ModuleId: string): Promise<ICarCategoryDocument>;
}

export const loadCarCategoryClass = (models: IModels) => {
  class CarCategories {
    public static async getCarCategory(_id: string) {
      const carCategories = await models.CarCategories.findOne({ _id }).lean();
      return carCategories;
    }

    public static async getCarCategories(): Promise<ICarCategoryDocument[]> {
      return models.CarCategories.find().lean();
    }

    public static async createCarCategory(
      doc: ICarCategory,
    ): Promise<ICarCategoryDocument> {
      return models.CarCategories.create(doc);
    }

    public static async updateCarCategory(_id: string, doc: ICarCategory) {
      return models.CarCategories.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    public static async removeCarCategory(CarCategoryId: string) {
      return models.CarCategories.deleteOne({ _id: { $in: CarCategoryId } });
    }
  }

  categorySchema.loadClass(CarCategories);
  return categorySchema;
};
