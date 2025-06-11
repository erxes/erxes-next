import { IContext } from '~/connectionResolvers';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICarDocument, ICarParams } from '~/modules/module/@types/car';
import { checkPermission, requireLogin } from 'erxes-api-shared/core-modules';

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

  carDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Cars.findOne({ _id }).lean();
  },

  //Cars list
  cars: async (
    _root: undefined,
    params: ICarParams,
    { commonQuerySelector, models }: IContext,
  ) => {
    const filter = await generateFilter(params, commonQuerySelector, models);

    console.log(1111);

    const { list, totalCount, pageInfo } = await cursorPaginate<ICarDocument>({
      model: models.Cars,
      params,
      query: filter,
    });

    console.log({ list, totalCount, pageInfo });

    return { list, totalCount, pageInfo };
  },

  //Cars count

  // carCounts: async (
  //   _root,
  //   params,
  //   { commonQuerySelector, commonQuerySelectorElk, models, subdomain }: IContext
  // ) => {
  //   const counts = {
  //     bySegment: {},
  //     byTag: {},
  //   };

  //   const { only } = params;

  //   const qb = new Builder(models, subdomain, params, {
  //     commonQuerySelector,
  //     commonQuerySelectorElk,
  //   });

  //   switch (only) {
  //     case "bySegment":
  //       counts.bySegment = await countBySegment(subdomain, "cars:car", qb);
  //       break;
  //   }

  //   return counts;
  //}
};

requireLogin(carQueries, 'showCars');

checkPermission(carQueries, 'cars', 'showCars');
checkPermission(carQueries, 'carDetail', 'showCars');
