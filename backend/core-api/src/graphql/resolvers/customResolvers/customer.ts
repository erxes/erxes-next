import { IContext } from 'backend/core-api/src/connectionResolvers';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    const customer = await models.Customers.findOne({ _id });
    return customer;
  },
};
