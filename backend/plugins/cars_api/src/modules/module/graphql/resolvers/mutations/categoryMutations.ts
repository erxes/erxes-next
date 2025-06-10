import { IContext } from '~/connectionResolvers';

import {
  ICarCategory,
  ICarCategoryDocument,
} from '~/modules/module/@types/category';

export const carCategoryMutations = {
  carCategoriesAdd: async (
    _root: undefined,
    doc: ICarCategory,
    { models }: IContext,
  ) => {
    return await models.CarCategories.createCarCategory({ ...doc });
  },

  carCategoriesEdit: async (
    _root: undefined,
    { _id, ...doc }: ICarCategoryDocument,
    { models }: IContext,
  ) => {
    return await models.CarCategories.updateCarCategory(_id, doc);
  },

  carCategoriesRemove: async (
    _root: undefined,
    { _id }: ICarCategoryDocument,
    { models }: IContext,
  ) => {
    return await models.CarCategories.removeCarCategory(_id);
  },
};
