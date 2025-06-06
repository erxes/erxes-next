import {
  ICustomField,
  IProduct,
  IProductCategory,
} from 'erxes-api-shared/core-types';
import { IModels } from '../../connectionResolvers';

export const checkCodeMask = (category?: IProductCategory, code?: string) => {
  if (!category || !code) {
    return false;
  }

  if (
    !category ||
    !category.maskType ||
    !category.mask ||
    !category.mask.values
  ) {
    return true;
  }

  let maskStr = '';
  const maskList: any[] = [];

  for (const value of category.mask.values || []) {
    if (value.static) {
      maskList.push(value.static);
      continue;
    }

    if (value.type === 'char') {
      maskList.push(value.char.replace(/./g, '\\.'));
    }

    if (value.type === 'customField' && value.matches) {
      maskList.push(`(${Object.values(value.matches).join('|')})`);
    }
  }
  maskStr = `${maskList.join('')}.*`;

  const mask = new RegExp(maskStr, 'g');

  if (mask.test(code)) {
    return true;
  }

  return false;
};

export const initCustomField = async (
  models: IModels,
  category: IProductCategory,
  code: string,
  productCustomFieldsData?: ICustomField[],
  docCustomFieldsData?: ICustomField[],
) => {
  if (
    !category ||
    !category.maskType ||
    !category.mask ||
    !category.mask.values
  ) {
    if (docCustomFieldsData && docCustomFieldsData.length) {
      const docFieldsIds = docCustomFieldsData.map((d) => d.field);
      const allCustomFieldsData = docCustomFieldsData.concat(
        (productCustomFieldsData || []).filter(
          (d) => !docFieldsIds.includes(d.field),
        ),
      );

      return models.Fields.prepareCustomFieldsData(allCustomFieldsData);
    }

    return productCustomFieldsData;
  }

  let strInd = 0;
  let customFieldsData: ICustomField[] = [];

  for (const value of category.mask.values || []) {
    const len = Number(value.len);
    if (value.static || value.type === 'char') {
      strInd += len;
      continue;
    }

    if (value.type === 'customField' && value.matches) {
      const subCode = code.substring(strInd, strInd + len);

      const subCodeInd = Object.values(value.matches).indexOf(subCode);

      customFieldsData.push({
        field: value.fieldId,
        value: (Object.keys(value.matches) || [])[subCodeInd],
      });
      strInd += len;
    }
  }

  const codeFieldIds = customFieldsData.map((d) => d.field);
  customFieldsData = customFieldsData.concat(
    (docCustomFieldsData || []).filter((d) => !codeFieldIds.includes(d.field)),
  );

  const withDocFieldIds = customFieldsData.map((d) => d.field);
  customFieldsData = customFieldsData.concat(
    (productCustomFieldsData || []).filter(
      (d) => !withDocFieldIds.includes(d.field),
    ),
  );

  return models.Fields.prepareCustomFieldsData(customFieldsData);
};

export const checkSameMaskConfig = async (models: IModels, doc: IProduct) => {
  if (!doc.customFieldsData) {
    return undefined;
  }

  const similarityGroups = await models.ProductsConfigs.getConfig(
    'similarityGroup',
  );

  if (!similarityGroups) {
    return undefined;
  }

  const masks = Object.keys(similarityGroups);
  const customFieldIds = (doc.customFieldsData || []).map((cf) => cf.field);

  const result: string[] = [];

  for (const mask of masks) {
    const maskValue = similarityGroups[mask];
    const filterFieldDef = maskValue.filterField || 'code';

    const codeRegex = ['*', '.', '_'].includes(mask)
      ? new RegExp(
          `^${mask
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.')
            .replace(/_/g, '.')}.*`,
          'igu',
        )
      : new RegExp(`.*${mask}.*`, 'igu');

    const filterFieldVal = filterFieldDef.includes('customFieldsData.')
      ? (
          doc.customFieldsData.find(
            (cfd) =>
              filterFieldDef.replace('customFieldsData.', '') === cfd.field,
          ) || {}
        ).stringValue
      : doc[filterFieldDef];

    if (
      (filterFieldVal || '').match(codeRegex) &&
      (maskValue.rules || [])
        .map((sg) => sg.fieldId)
        .filter((sgf) => (customFieldIds || []).includes(sgf)).length ===
        (maskValue.rules || []).length
    ) {
      result.push(mask);
    }
  }

  if (result.length) {
    return result;
  }

  return undefined;
};

export const groupBySameMasksAggregator = (isCount = false) => {
  const sameArr = [
    {
      $addFields: {
        sameMasksLen: {
          $cond: {
            if: { $isArray: '$sameMasks' },
            then: { $size: '$sameMasks' },
            else: 0,
          },
        },
      },
    },
    {
      $addFields: {
        sameMasks: {
          $cond: {
            if: { $gt: ['$sameMasksLen', 0] },
            then: '$sameMasks',
            else: ['$_id'],
          },
        },
      },
    },
    {
      $unwind: '$sameMasks',
    },
    {
      $addFields: {
        sameSort: {
          $cond: {
            if: {
              $and: [
                { $isArray: '$sameDefault' },
                { $in: ['$sameMasks', '$sameDefault'] },
              ],
            },
            then: '1',
            else: '',
          },
        },
      },
    },
  ];

  if (isCount) {
    return [
      ...sameArr,
      {
        $group: {
          _id: { sameMasks: '$sameMasks' },
          product: { $first: '$code' },
        },
      },
      {
        $group: {
          _id: { code: '$product' },
        },
      },
    ];
  }

  return [
    ...sameArr,
    { $sort: { sameSort: -1 } },
    {
      $group: {
        _id: { sameMasks: '$sameMasks' },
        count: { $sum: 1 },
        product: { $first: '$$ROOT' },
      },
    },
  ];
};

export const groupByCategoryAggregator = (isCount = false) => {
  const sameArr = [
    {
      $lookup: {
        from: 'product_categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $addFields: {
        same: {
          $cond: {
            if: {
              $and: [
                { $eq: ['$category.isSimilarity', true] },
                {
                  $setIsSubset: [
                    '$category.similarities.fieldId',
                    '$customFieldsData.field',
                  ],
                },
              ],
            },
            then: '$categoryId',
            else: '$_id',
          },
        },
      },
    },
  ];

  if (isCount) {
    return [
      ...sameArr,
      {
        $group: {
          _id: { same: '$same' },
        },
      },
    ];
  }

  return [
    ...sameArr,
    {
      $group: {
        _id: { same: '$same' },
        count: { $sum: 1 },
        product: { $first: '$$ROOT' },
      },
    },
  ];
};

export const aggregatePaginator = (params) => {
  const { perPage = 20, page = 1 } = params;
  return [{ $skip: perPage * (page - 1) }, { $limit: perPage }];
};

export const getSimilaritiesProducts = async (
  models,
  filter,
  sortParams,
  params,
) => {
  const sortKey: string = Object.keys(sortParams)[0] || 'code';
  const productSort = {
    [`product.${sortKey}`]: sortParams[sortKey] || 1,
  };

  const aggregates =
    params.groupedSimilarity === 'config'
      ? groupBySameMasksAggregator()
      : groupByCategoryAggregator();

  const groupedData = await models.Products.aggregate([
    { $match: filter },
    { $sort: sortParams },
    ...aggregates,
    { $sort: productSort },
    ...aggregatePaginator(params),
  ]);

  return groupedData.map((gd) => ({
    ...gd.product,
    hasSimilarity: gd.count > 1,
  }));
};

export const getSimilaritiesProductsCount = async (models, filter, params) => {
  const aggregates =
    params.groupedSimilarity === 'config'
      ? groupBySameMasksAggregator(true)
      : groupByCategoryAggregator(true);
  const groupedData = await models.Products.aggregate([
    { $match: filter },
    ...aggregates,
    { $group: { _id: {}, count: { $sum: 1 } } },
  ]);

  return ((groupedData || [])[0] || {}).count || 0;
};
