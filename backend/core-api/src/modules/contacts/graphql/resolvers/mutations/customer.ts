import { ICustomer } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

export const customerMutations = {
  /**
   * Create new customer also adds Customer registration log
   */
  async customersAdd(_parent: undefined, doc: ICustomer, { models }: IContext) {
    const customer = await models.Customers.createCustomer(doc);

    return customer;
  },

  /**
   * Updates a customer
   */
  async customersEdit(
    _parent: undefined,
    { _id, ...doc }: { _id: string } & ICustomer,
    { models }: IContext,
  ) {
    const updated = await models.Customers.updateCustomer(_id, doc);

    return updated;
  },

  /**
   * Remove customers
   */
  async customersRemove(
    _parent: undefined,
    { customerIds }: { customerIds: string[] },
    { models }: IContext,
  ) {
    await models.Customers.removeCustomers(customerIds);

    return customerIds;
  },
    async customersMerge(
    _root,
    {
      customerIds,
      customerFields
    }: { customerIds: string[]; customerFields: ICustomer },
    { user, models: { Customers } }: IContext
  ) {
    return Customers.mergeCustomers(customerIds, customerFields, user);
  },
};
