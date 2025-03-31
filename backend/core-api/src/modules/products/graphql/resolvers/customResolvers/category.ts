import { IContext } from 'core-api/@types';
import { IProductCategoryDocument } from 'core-api/modules/products/@types/category';
import { escapeRegExp } from 'erxes-api-utils';
import { PRODUCT_STATUSES } from '../../../constants';

export default {
  __resolveReference: async ({ _id }, { models }: IContext) => {
    return models.ProductCategories.findOne({ _id });
  },
  isRoot: (category: IProductCategoryDocument) => {
    return category.parentId ? false : true;
  },
  productCount: async (
    category: IProductCategoryDocument,
    {},
    { models }: IContext,
  ) => {
    const product_category_ids = await models.ProductCategories.find(
      { order: { $regex: new RegExp(`^${escapeRegExp(category.order)}`) } },
      { _id: 1 },
    );
    return models.Products.countDocuments({
      categoryId: { $in: product_category_ids },
      status: { $ne: PRODUCT_STATUSES.DELETED },
    });
  },
};
