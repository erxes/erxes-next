import {
  ICompanyDocument,
  ICompanyFilterQueryParams,
} from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { generateFilter } from '~/modules/contacts/utils';

export const companyQueries = {
  /**
   * Get companies
   */
  companies: async (
    _parent: undefined,
    params: ICompanyFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<ICompanyFilterQueryParams> = await generateFilter(
      params,
      models,
    );

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
