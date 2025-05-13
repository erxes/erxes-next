import { IContext } from '~/connectionResolvers';
import { cursorPaginate } from 'erxes-api-shared/utils';
import {
  ICursorPaginateParams,
  IListParams,
} from 'erxes-api-shared/core-types';
export const unitsQueries = {
async units(
    _root,
    { searchValue }: { searchValue?: string },
    { models }: IContext,
  ) {
    const filter: { $or?: any[] } = {};

    if (searchValue) {
      const regexOption = {
        $regex: `.*${searchValue.trim()}.*`,
        $options: 'i',
      };

      filter.$or = [
        {
          title: regexOption,
        },
        {
          description: regexOption,
        },
      ];
    }

    return models.Units.find(filter).sort({ title: 1 });
  },
 async unitsMain(
    _root,
    params: IListParams & ICursorPaginateParams,
    { models }: IContext,
  ) {
     const filter: { $or?: any[] } = {};

  if (params.searchValue) {
    const regex = {
      $regex: `.*${params.searchValue.trim()}.*`,
      $options: 'i',
    };

    filter.$or = [
      { title: regex },
      { description: regex },
    ];
  }

  const { list, totalCount, pageInfo } = await cursorPaginate({
    model: models.Units,
    params,
    query: filter,
  });

  return { list, totalCount, pageInfo };
  },

  async unitDetail(_root, { _id }, { models }: IContext) {
    return models.Units.getUnit({ _id });
  },

};
