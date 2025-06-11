import { Model } from 'mongoose';
import { ICarCategory, ICarCategoryDocument } from '../../@types/category';
import { IModels } from '~/connectionResolvers';
import { categorySchema } from '../definitions/category';

export interface ICarCategoryModel extends Model<ICarCategoryDocument> {
  carCategoryDetail(selector: any): Promise<ICarCategoryDocument>;
  carsCategoryAdd(doc: ICarCategory): Promise<ICarCategoryDocument>;
  carsCategories(doc: ICarCategory): Promise<ICarCategoryDocument>;
  carsCategoriesEdit(
    _id: string,
    doc: ICarCategory,
  ): Promise<ICarCategoryDocument>;
  carsCategoriesRemove(ModuleId: string): Promise<ICarCategoryDocument>;
}

export const loadCarCategoryClass = (models: IModels) => {
  class CarCategories {
    public static async carCategoryDetail(_id: string) {
      const carCategories = await models.CarCategories.findOne({ _id }).lean();
      return carCategories;
    }

    public static async carsCategories(): Promise<ICarCategoryDocument[]> {
      return models.CarCategories.find().lean();
    }

    public static async carsCategoryAdd(
      doc: ICarCategory,
    ): Promise<ICarCategoryDocument> {
      return models.CarCategories.create(doc);
    }

    public static async carsCategoriesEdit(_id: string, doc: ICarCategory) {
      return models.CarCategories.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    public static async carsCategoriesRemove(CarCategoryId: string) {
      return models.CarCategories.deleteOne({ _id: { $in: CarCategoryId } });
    }
  }

  categorySchema.loadClass(CarCategories);
  return categorySchema;
};
