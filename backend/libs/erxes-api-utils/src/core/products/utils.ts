import { ICustomField, IProduct, IProductCategory } from '../@types';

export const checkCodeMask = async (
  category?: IProductCategory,
  code?: string,
) => {
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

  if (await mask.test(code)) {
    return true;
  }

  return false;
};

export const initCustomField = async (
  models,
  subdomain: string,
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

export const checkSameMaskConfig = async (models, doc: IProduct) => {
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
