import { IContext } from '~/connectionResolvers';

export const CarCategoryQueries = {
  getCarCategory: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CarCategories.findOne({ _id });
  },
  getCarCategories: async (
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

  getCarCategoriesCount: async (
    _root: undefined,
    _param: any,
    { models }: IContext,
  ) => {
    return models.CarCategories.find().countDocuments();
  },
};
