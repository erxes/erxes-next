import { IContext } from '~/connectionResolvers';
import { cursorPaginate, paginate } from 'erxes-api-shared/utils';
import { ICarDocument } from '~/modules/module/@types/car';

export const generateFilter = async (params, commonQuerySelector, models) => {
  const { tag } = params;

  const filter: any = commonQuerySelector;

  if (params.categoryId) {
    filter.categoryId = params.categoryId;
  }

  if (params.searchValue) {
    filter.searchText = { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] };
  }

  if (params.ids) {
    filter._id = { $in: params.ids };
  }

  if (tag) {
    filter.tagIds = { $in: [tag] };
  }

  return filter;
};

export const sortBuilder = (params) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

export const carQueries = {
  //CarDetail

  getCar: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Cars.findOne({ _id }).lean();
  },

  //Cars list
  cars: async (
    _root: undefined,
    params: any,
    { commonQuerySelector, models }: IContext,
  ) => {
    const filter = await generateFilter(params, commonQuerySelector, models);

    const { list, totalCount, pageInfo } = await cursorPaginate<ICarDocument>({
      model: models.Cars,
      params,
      query: filter,
    });

    return { list, totalCount, pageInfo };
  },

  carsMain: async (
    _root: undefined,
    params: any,
    { commonQuerySelector, models }: IContext,
  ) => {
    const filter = await generateFilter(params, commonQuerySelector, models);

    return {
      list: await paginate(models.Cars.find(filter).sort(sortBuilder(params)), {
        page: params.page,
        perPage: params.perPage,
      }),
      totalCount: await models.Cars.find(filter).countDocuments(),
    };
  },

  //Cars count

  carsCount: async (
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.Cars.find().countDocuments();
  },
};
