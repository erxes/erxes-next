import { IContext } from 'backend/core-api/src/connectionResolvers';

interface IListArgs {
  page?: number;
  perPage?: number;
  searchValue?: string;
}

const queryBuilder = (params: IListArgs, brandIdSelector: any) => {
  const selector: any = { ...brandIdSelector };

  const { searchValue } = params;

  if (searchValue) {
    selector.name = new RegExp(`.*${params.searchValue}.*`, 'i');
  }

  return selector;
};

export const brandQueries = {
  /**
   * All brands
   */

  async allBrands(_root, _, { brandIdSelector, models }: IContext) {
    return models.Brands.find(brandIdSelector).lean();
  },

  /**
   * Brands list
   */
  async brands(
    _root,
    args: IListArgs,
    { brandIdSelector, models, user }: IContext,
  ) {
    const selector = queryBuilder(args, brandIdSelector);

    return models.Brands.find(selector).sort({ createdAt: -1 });
  },

  /**
   * Get one brand
   */
  async brandDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Brands.findOne({ _id });
  },

  /**
   * Get all brands count. We will use it in pager
   */
  async brandsTotalCount(_root, _args, { brandIdSelector, models }: IContext) {
    return models.Brands.find(brandIdSelector).countDocuments();
  },

  /**
   * Get last brand
   */
  async brandsGetLast(_root, _args, { models }: IContext) {
    return models.Brands.findOne({}).sort({ createdAt: -1 });
  },
};

export default brandQueries;
