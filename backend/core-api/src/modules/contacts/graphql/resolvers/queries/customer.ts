import {
  ICustomerDocument,
  ICustomerQueryFilterParams,
} from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { generateFilter } from '~/modules/contacts/utils';

export const customerQueries = {
  /**
   * Customers list
   */
  async customers(
    _parent: undefined,
    params: ICustomerQueryFilterParams,
    { models }: IContext,
  ) {
    const filter: FilterQuery<ICustomerQueryFilterParams> =
      await generateFilter(params, models);

    const { list, totalCount, pageInfo } =
      await cursorPaginate<ICustomerDocument>({
        model: models.Customers,
        params,
        query: filter,
      });

    return { list, totalCount, pageInfo };
  },

  /**
   * Get one customer
   */
  async customerDetail(
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Customers.getCustomer(_id);
  },
};
