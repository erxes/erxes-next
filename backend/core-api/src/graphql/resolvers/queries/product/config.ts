import { IContext } from 'backend/core-api/src/connectionResolvers';

export const productConfigQueries = {
  /**
   * ProductConfig object
   */
  async productsConfigs(_root, _args, { models }: IContext) {
    return models.ProductsConfigs.find({});
  },
};
