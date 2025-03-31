import { IContext } from 'core-api/@types';

export const configQueries = {
  /**
   * ProductConfig object
   */
  async productsConfigs(
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) {
    return await models.ProductsConfigs.find({});
  },
};
