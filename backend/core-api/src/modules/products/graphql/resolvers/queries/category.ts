import { escapeRegExp } from 'erxes-api-utils';
import { FilterQuery } from 'mongoose';
import { IProductCategoryParams } from '../../../@types/category';
import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IContext } from 'backend/core-api/src/@types';

const generateFilter = async (
  models,
  {
    parentId,
    withChild,
    searchValue,
    meta,
    brand,
    status,
    ids,
  }: IProductCategoryParams,
) => {
  const filter: FilterQuery<IProductCategoryParams> = {};

  filter.status = { $nin: ['disabled', 'archived'] };

  if (status && status !== 'active') {
    filter.status = status;
  }

  if (parentId) {
    if (withChild) {
      const category = await (
        models as IModels
      ).ProductCategories.getProductCategory({
        _id: parentId,
      });

      const relatedCategoryIds = (
        await models.ProductCategories.find(
          { order: { $regex: new RegExp(`^${escapeRegExp(category.order)}`) } },
          { _id: 1 },
        ).lean()
      ).map((c) => c._id);

      filter.parentId = { $in: relatedCategoryIds };
    } else {
      filter.parentId = parentId;
    }
  }

  if (brand) {
    filter.scopeBrandIds = { $in: [brand] };
  }

  if (meta) {
    if (typeof meta === 'number' && !isNaN(meta)) {
      filter.meta = { $lte: Number(meta) };
    } else {
      filter.meta = meta;
    }
  }

  if (searchValue) {
    filter.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  if (ids?.length > 0) {
    filter._id = { $in: ids };
  }

  return filter;
};

export const categoryQueries = {
  async productCategories(
    _root,
    params: IProductCategoryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(models, params);

    const sortParams: any = { order: 1 };

    return await models.ProductCategories.find(filter).sort(sortParams).lean();
  },

  async productCategoriesTotalCount(
    _root,
    params: IProductCategoryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(models, params);

    return models.ProductCategories.find(filter).countDocuments();
  },

  async productCategoryDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.ProductCategories.findOne({ _id }).lean();
  },
};
