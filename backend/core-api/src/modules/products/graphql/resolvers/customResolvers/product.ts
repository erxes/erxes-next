import { IContext } from 'core-api/@types';
import { IProductDocument } from 'core-api/modules/products/@types/product';

export default {
  __resolveReference: async ({ _id }, { models }: IContext) => {
    return models.Products.findOne({ _id });
  },
  category: async (product: IProductDocument, _, { dataLoaders }: IContext) => {
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
