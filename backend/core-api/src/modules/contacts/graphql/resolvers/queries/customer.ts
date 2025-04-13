import { paginateMongooseCollection } from 'erxes-api-shared/utils';
import { ICustomerQueryFilterParams } from 'erxes-api-shared/core-types';
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
    _root,
    params: ICustomerQueryFilterParams,
    { models }: IContext,
  ) {
    const filter = generateFilter(params);

    const list = await paginateMongooseCollection(
      models.Customers.find(filter),
      params,
    );

    const totalCount = await models.Customers.find(filter).countDocuments();

    return { list, totalCount };
  },
  /**
   * Get one customer
   */
  async customerDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Customers.getCustomer(_id);
  },
};
