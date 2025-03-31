import { IContext } from 'backend/core-api/src/@types';
import { IProductDocument } from '../../../@types/product';

export default {
  __resolveReference: async ({ _id }, { models }: IContext) => {
    return models.Products.findOne({ _id });
  },
  category: async (
    product: IProductDocument,
    _args: undefined,
    { dataLoaders }: IContext,
  ) => {
    return (
      (product.categoryId &&
        dataLoaders.productCategory.load(product.categoryId)) ||
      null
    );
  },
  vendor: (product: IProductDocument, _, { dataLoaders }: IContext) => {
    return (
      (product.vendorId && dataLoaders.company.load(product.vendorId)) || null
    );
  },
};
