import { IContext } from '~/connectionResolvers';
import { ICarParams } from '~/modules/module/@types/car';
import { generateFilter } from './carQueries';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICarCategoryDocument } from '~/modules/module/@types/category';

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
    params: ICarParams,
    { commonQuerySelector, models }: IContext,
  ) => {
    const filter = await generateFilter(params, commonQuerySelector, models);

    const { list, totalCount, pageInfo } =
      await cursorPaginate<ICarCategoryDocument>({
        model: models.CarCategories,
        params,
        query: filter,
      });

    return { list, totalCount, pageInfo };
  },

  carCategoriesTotalCount: async (
    _root: undefined,
    _param: ICarParams,
    { models }: IContext,
  ) => {
    return models.CarCategories.find().countDocuments();
  },
};
