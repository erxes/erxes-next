import { IContext } from 'core-api/@types';

export const configQueries = {
  /**
   * ProductConfig object
   */
  async productsConfigs(_root, _args, { models }: IContext) {
    return models.ProductsConfigs.find({});
  },
};
