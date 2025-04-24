import {
  ICustomerDocument,
  ICustomerQueryFilterParams,
} from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

const generateFilter = (params: ICustomerQueryFilterParams) => {
  const { searchValue } = params;

  const filter = {};

  if (searchValue) {
    filter['$or'] = [
      { firstName: { $regex: searchValue, $options: 'i' } },
      { lastName: { $regex: searchValue, $options: 'i' } },
      { primaryEmail: { $regex: searchValue, $options: 'i' } },
    ];
  }

  return filter;
};

export const customerQueries = {
  /**
   * Customers list
   */
  async customers(
    _root: undefined,
    params: ICustomerQueryFilterParams,
    { models }: IContext,
  ) {
    const filter = generateFilter(params);

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
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Customers.getCustomer(_id);
  },
};
