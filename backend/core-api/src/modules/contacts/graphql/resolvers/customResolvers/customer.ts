import { IContext } from '../../../../../connectionResolvers';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    const customer = await models.Customers.findOne({ _id });
    return customer;
  },
};
