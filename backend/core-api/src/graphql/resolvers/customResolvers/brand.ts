import { IContext } from 'backend/core-api/src/connectionResolvers';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.Brands.findOne({ _id });
  },
};
