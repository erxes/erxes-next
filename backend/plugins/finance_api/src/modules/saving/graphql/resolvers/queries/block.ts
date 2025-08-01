import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import {
  IBlockDocument,
  IBlockQueryParams,
} from '~/modules/saving/@types/blockTypes';

const generateFilter = async (params: IBlockQueryParams) => {
  const filter: any = {};

  if (params.ids) {
    filter._id = { $in: params.ids };
  }

  return filter;
};

export const sortBuilder = (params: IBlockQueryParams) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

const blockQueries = {
  /**
   * Blocks list
   */
  savingsBlocks: async (
    _root: undefined,
    params: IBlockQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<IBlockDocument> = await generateFilter(params);

    return cursorPaginate<IBlockDocument>({
      model: models.Blocks,
      params,
      query: filter,
    });
  },
};

export default blockQueries;
