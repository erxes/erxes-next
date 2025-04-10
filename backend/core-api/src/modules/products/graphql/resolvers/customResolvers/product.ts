// import { IProductDocument } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

export default {
  __resolveReference: async (
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Products.findOne({ _id });
  },
  // category: async (
  //   product: IProductDocument,
  //   _args: undefined,
  //   { dataLoaders }: IContext,
  // ) => {
  //   return (
  //     (product.categoryId &&
  //       dataLoaders?.productCategory.load(product.categoryId)) ||
  //     null
  //   );
  // },
  // vendor: (
  //   product: IProductDocument,
  //   _args: undefined,
  //   { dataLoaders }: IContext,
  // ) => {
  //   return (
  //     (product.vendorId && dataLoaders?.company.load(product.vendorId)) || null
  //   );
  // },
};
