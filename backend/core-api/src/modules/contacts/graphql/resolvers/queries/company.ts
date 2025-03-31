import { IContext } from 'backend/core-api/src/@types';
import { ICompanyDocument, ICompanyFilterQueryParams } from 'erxes-core-types';
import { paginate } from 'erxes-api-utils';
import { FilterQuery } from 'mongoose';

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
  companiesMain: async (
    _parent: undefined,
    params: ICompanyFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<ICompanyFilterQueryParams> =
      generateFilter(params);

    const list: ICompanyDocument[] = await paginate(
      models.Companies.find(filter),
      params,
    );

    const totalCount: number = await models.Companies.find(
      filter,
    ).countDocuments();

    return { list, totalCount };
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
