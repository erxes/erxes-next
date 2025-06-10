import { IContext } from '~/connectionResolvers';
import { ICarParams } from '~/modules/module/@types/car';

export const CarCategoryQueries = {
  carCategoryDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CarCategories.findOne({ _id });
  },
  carCategories: async (
    _root: undefined,
    { parentId, searchValue },
    { commonQuerySelector, models }: IContext,
  ) => {
    const filter: any = commonQuerySelector;

    if (parentId) {
      filter.parentId = parentId;
    }

    if (searchValue) {
      filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    return models.CarCategories.find(filter).sort({ order: 1 });
  },

  carCategoriesTotalCount: async (
    _root: undefined,
    _param: ICarParams,
    { models }: IContext,
  ) => {
    return models.CarCategories.find().countDocuments();
  },
};
