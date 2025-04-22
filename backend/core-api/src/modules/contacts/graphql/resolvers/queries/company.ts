import {
  ICompanyDocument,
  ICompanyFilterQueryParams,
} from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';

const generateFilter = (params: ICompanyFilterQueryParams) => {
  const { searchValue } = params;

  const filter: FilterQuery<ICompanyFilterQueryParams> = {};

  if (searchValue) {
    filter['$or'] = [
      { primaryName: { $regex: searchValue, $options: 'i' } },
      { primaryEmail: { $regex: searchValue, $options: 'i' } },
      { primaryPhone: { $regex: searchValue, $options: 'i' } },
      { primaryAddress: { $regex: searchValue, $options: 'i' } },
      { code: { $regex: searchValue, $options: 'i' } },
    ];
  }

  return filter;
};

export const companyQueries = {
  /**
   * Get companies
   */
  companies: async (
    _parent: undefined,
    params: ICompanyFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<ICompanyFilterQueryParams> =
      generateFilter(params);

    const { list, totalCount, pageInfo } =
      await cursorPaginate<ICompanyDocument>({
        model: models.Companies,
        params,
        query: filter,
      });

    return { list, totalCount, pageInfo };
  },

  /**
   * Get one company
   */
  companyDetail: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Companies.findOne({ $or: [{ _id }, { code: _id }] });
  },
};
