import { ICustomer } from 'erxes-core-types';
import { IContext } from '../../../../../@types/common';

export const customerMutations = {
  /**
   * Create new customer also adds Customer registration log
   */
  async customersAdd(_root, doc: ICustomer, { models }: IContext) {
    const customer = await models.Customers.createCustomer(doc);

    return customer;
  },

  /**
   * Updates a customer
   */
  async customersEdit(
    _root,
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
    _root,
    { customerIds }: { customerIds: string[] },
    { models }: IContext,
  ) {
    await models.Customers.removeCustomers(customerIds);

    return customerIds;
  },
};
