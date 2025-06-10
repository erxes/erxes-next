import { IContext } from '~/connectionResolvers';

import {
  ICarCategory,
  ICarCategoryDocument,
} from '~/modules/module/@types/category';

export const carCategoryMutations = {
  createCarCategory: async (
    _root: undefined,
    doc: ICarCategory,
    { models }: IContext,
  ) => {
    return await models.CarCategories.createCarCategory({ ...doc });
  },

  updateCarCategory: async (
    _root: undefined,
    { _id, ...doc }: ICarCategoryDocument,
    { models }: IContext,
  ) => {
    return await models.CarCategories.updateCarCategory(_id, doc);
  },

  removeCarCategory: async (
    _root: undefined,
    { _id }: ICarCategoryDocument,
    { models }: IContext,
  ) => {
    return await models.CarCategories.removeCarCategory(_id);
  },
};
