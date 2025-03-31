import { escapeRegExp, paginate } from 'erxes-api-utils';
import { FilterQuery, SortOrder } from 'mongoose';
import { PRODUCT_STATUSES } from '../../../constants';
import {
  getSimilaritiesProducts,
  getSimilaritiesProductsCount,
} from '../../../utils';
import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IProductDocument, IProductParams } from '../../../@types/product';
import { IContext } from 'backend/core-api/src/@types';

const generateFilter = async (
  subdomain: string,
  models: IModels,
  commonQuerySelector: any,
  params: IProductParams,
) => {
  const {
    type,
    categoryId,
    searchValue,
    vendorId,
    brand,
    tag,
    ids,
    excludeIds,
    image,
  } = params;

  const filter: FilterQuery<IProductParams> = commonQuerySelector;

  const andFilters: any[] = [];

  filter.status = { $ne: PRODUCT_STATUSES.DELETED };

  if (params.status) {
    filter.status = params.status;
  }

  if (type) {
    filter.type = type;
  }

  if (categoryId) {
    const categories = await models.ProductCategories.getChildCategories([
      categoryId,
    ]);
    const catIds = categories.map((c) => c._id);
    andFilters.push({ categoryId: { $in: catIds } });
  } else {
    const notActiveCategories = await models.ProductCategories.find({
      status: { $nin: [null, 'active'] },
    });

    andFilters.push({
      categoryId: { $nin: notActiveCategories.map((e) => e._id) },
    });
  }

  if (ids && ids.length > 0) {
    filter._id = { [excludeIds ? '$nin' : '$in']: ids };
  }

  if (tag) {
    filter.tagIds = { $in: [tag] };
  }

  // search =========
  if (searchValue) {
    const regex = new RegExp(`.*${escapeRegExp(searchValue)}.*`, 'i');

    let codeFilter = { code: { $in: [regex] } };
    if (
      searchValue.includes('.') ||
      searchValue.includes('_') ||
      searchValue.includes('*')
    ) {
      const codeRegex = new RegExp(
        `^${searchValue.replace(/\*/g, '.').replace(/_/g, '.')}$`,
        'igu',
      );
      codeFilter = { code: { $in: [codeRegex] } };
    }

    filter.$or = [
      codeFilter,
      { name: { $in: [regex] } },
      { barcodes: { $in: [searchValue] } },
    ];
  }

  if (vendorId) {
    filter.vendorId = vendorId;
  }

  if (brand) {
    filter.scopeBrandIds = { $in: [brand] };
  }

  if (image) {
    filter['attachment.url'] =
      image === 'hasImage' ? { $exists: true } : { $exists: false };
  }

  return { ...filter, ...(andFilters.length ? { $and: andFilters } : {}) };
};

export const productQueries = {
  /**
   * Products list
   */
  async products(
    _root,
    params: any,
    { commonQuerySelector, models, subdomain, user }: IContext,
  ) {
    const filter = await generateFilter(
      subdomain,
      models,
      commonQuerySelector,
      params,
    );

    const { sortField, sortDirection, page, perPage, ids, excludeIds } = params;

    const paginationArgs = { page, perPage };

    if (
      ids &&
      ids.length &&
      !excludeIds &&
      ids.length > (paginationArgs.perPage || 20)
    ) {
      paginationArgs.page = 1;
      paginationArgs.perPage = ids.length;
    }

    let sort: { [key: string]: SortOrder } = { code: 1 };

    if (sortField) {
      sort = { [sortField]: (sortDirection || 1) as SortOrder };
    }

    if (params.groupedSimilarity) {
      return await getSimilaritiesProducts(models, filter, sort, {
        groupedSimilarity: params.groupedSimilarity,
        ...paginationArgs,
      });
    }

    return await paginate(
      models.Products.find(filter).sort(sort).lean(),
      paginationArgs,
    );
  },

  async productDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return await models.Products.findOne({ _id }).lean();
  },

  async productsTotalCount(
    _root,
    params: IProductParams,
    { commonQuerySelector, models, subdomain }: IContext,
  ) {
    const filter = await generateFilter(
      subdomain,
      models,
      commonQuerySelector,
      params,
    );

    if (params.groupedSimilarity) {
      return await getSimilaritiesProductsCount(models, filter, {
        groupedSimilarity: params.groupedSimilarity,
      });
    }

    return await models.Products.find(filter).countDocuments();
  },

  async productSimilarities(
    _root,
    { _id, groupedSimilarity },
    { models }: IContext,
  ) {
    const product: IProductDocument = await models.Products.getProduct({ _id });

    if (groupedSimilarity === 'config') {
      const getRegex = (str) => {
        return ['*', '.', '_'].includes(str)
          ? new RegExp(
              `^${str
                .replace(/\./g, '\\.')
                .replace(/\*/g, '.')
                .replace(/_/g, '.')}.*`,
              'igu',
            )
          : new RegExp(`.*${escapeRegExp(str)}.*`, 'igu');
      };

      const similarityGroups = await models.ProductsConfigs.getConfig(
        'similarityGroup',
      );

      const codeMasks = Object.keys(similarityGroups);
      const customFieldIds = (product.customFieldsData || []).map(
        (cf) => cf.field,
      );

      const matchedMasks = codeMasks.filter((cm) => {
        const mask = similarityGroups[cm];
        const filterFieldDef = mask.filterField || 'code';
        const regexer = getRegex(cm);

        if (filterFieldDef.includes('customFieldsData.')) {
          if (
            !(product.customFieldsData || []).find(
              (cfd) =>
                cfd.field === filterFieldDef.replace('customFieldsData.', '') &&
                cfd.stringValue?.match(regexer),
            )
          ) {
            return false;
          }
        } else {
          if (!product[filterFieldDef]?.match(regexer)) {
            return false;
          }
        }

        return (
          (similarityGroups[cm].rules || [])
            .map((sg) => sg.fieldId)
            .filter((sgf) => customFieldIds.includes(sgf)).length ===
          (similarityGroups[cm].rules || []).length
        );
      });

      if (!matchedMasks.length) {
        return {
          products: await models.Products.find({ _id }),
        };
      }

      const codeRegexes: any[] = [];
      const fieldIds: string[] = [];
      const groups: { title: string; fieldId: string }[] = [];

      for (const matchedMask of matchedMasks) {
        const matched = similarityGroups[matchedMask];
        const filterFieldDef = matched.filterField || 'code';

        if (filterFieldDef.includes('customFieldsData.')) {
          codeRegexes.push({
            $and: [
              {
                'customFieldsData.field': filterFieldDef.replace(
                  'customFieldsData.',
                  '',
                ),
              },
              {
                'customFieldsData.stringValue': {
                  $in: [getRegex(matchedMask)],
                },
              },
            ],
          });
        } else {
          codeRegexes.push({
            [filterFieldDef]: { $in: [getRegex(matchedMask)] },
          });
        }

        for (const rule of similarityGroups[matchedMask].rules || []) {
          const { fieldId, title } = rule;
          if (!fieldIds.includes(fieldId)) {
            fieldIds.push(fieldId);
            groups.push({ title, fieldId });
          }
        }
      }

      const filters: any = {
        $and: [
          {
            $or: codeRegexes,
          },
          {
            'customFieldsData.field': { $in: fieldIds },
          },
        ],
      };

      let products: IProductDocument[] = await models.Products.find(
        filters,
      ).sort({ code: 1 });

      if (!products.length) {
        products = [product];
      }

      return {
        products,
        groups,
      };
    }

    const category = await models.ProductCategories.getProductCategory({
      _id: product.categoryId,
    });

    if (!category.isSimilarity || !category.similarities?.length) {
      return {
        products: await models.Products.find({ _id }),
      };
    }

    const fieldIds = category.similarities.map((r) => r.fieldId);

    const filters: any = {
      $and: [
        {
          categoryId: category._id,
          'customFieldsData.field': { $in: fieldIds },
        },
      ],
    };

    const groups: {
      title: string;
      fieldId: string;
    }[] = category.similarities.map((r) => ({ ...r }));

    return {
      products: await models.Products.find(filters).sort({ code: 1 }),
      groups,
    };
  },
};
