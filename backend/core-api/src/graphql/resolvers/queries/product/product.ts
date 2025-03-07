interface IQueryParams {
  ids?: string[];
  excludeIds?: boolean;
  type?: string;
  status?: string;
  categoryId?: string;
  searchValue?: string;
  vendorId?: string;
  brand?: string;
  tag: string;
  tags?: string[];
  excludeTags?: string[];
  tagWithRelated?: boolean;
  page?: number;
  perPage?: number;
  sortField?: string;
  sortDirection?: number;
  pipelineId?: string;
  boardId?: string;
  segment?: string;
  segmentData?: string;
  groupedSimilarity?: string;
  image?: string;
}

export const productQueries = {
  // async products(
  //     _root,
  //     params: IQueryParams,
  //     { commonQuerySelector, models, subdomain }: IContext
  //   ) {
  //     const filter = await generateFilter(
  //       subdomain,
  //       models,
  //       commonQuerySelector,
  //       params
  //     );
  //     const { sortField, sortDirection, page, perPage, ids, excludeIds } = params;
  //     const pagintationArgs = { page, perPage };
  //     if (
  //       ids &&
  //       ids.length &&
  //       !excludeIds &&
  //       ids.length > (pagintationArgs.perPage || 20)
  //     ) {
  //       pagintationArgs.page = 1;
  //       pagintationArgs.perPage = ids.length;
  //     }
  //     let sort: any = { code: 1 };
  //     if (sortField) {
  //       sort = { [sortField]: sortDirection || 1 };
  //     }
  //     return await paginate(
  //         models.Products.find(filter).sort(sort).lean(),
  //         pagintationArgs
  //       ),
  //   },
  //   async productsTotalCount(
  //     _root,
  //     params: IQueryParams,
  //     { commonQuerySelector, models, subdomain }: IContext
  //   ) {
  //     const filter = await generateFilter(
  //       subdomain,
  //       models,
  //       commonQuerySelector,
  //       params
  //     );
  //     return models.Products.find(filter).countDocuments();
  //   },
  //   /**
  //    * Group product counts by segment or tag
  //    */
  //   async productsGroupCounts(
  //     _root,
  //     params,
  //     { commonQuerySelector, commonQuerySelectorElk, models, subdomain }: IContext
  //   ) {
  //     const counts = {
  //       bySegment: {},
  //       byTag: {},
  //     };
  //     const { only } = params;
  //     return counts;
  //   },
  //   async productSimilarities(
  //     _root,
  //     { _id, groupedSimilarity },
  //     { models }: IContext
  //   ) {
  //     const product = await models.Products.getProduct({ _id });
  //     if (groupedSimilarity === 'config') {
  //       const getRegex = str => {
  //         return ['*', '.', '_'].includes(str) ? new RegExp(
  //           `^${str
  //             .replace(/\./g, '\\.')
  //             .replace(/\*/g, '.')
  //             .replace(/_/g, '.')}.*`,
  //           'igu',
  //         ) : new RegExp(`.*${escapeRegExp(str)}.*`, 'igu');
  //       };
  //       const similarityGroups =
  //         await models.ProductsConfigs.getConfig('similarityGroup');
  //       const codeMasks = Object.keys(similarityGroups);
  //       const customFieldIds = (product.customFieldsData || []).map(
  //         cf => cf.field
  //       );
  //       const matchedMasks = codeMasks.filter(cm => {
  //         const mask = similarityGroups[cm];
  //         const filterFieldDef = mask.filterField || 'code';
  //         const regexer = getRegex(cm);
  //         if (filterFieldDef.includes('customFieldsData.')) {
  //           if (
  //             !(product.customFieldsData || []).find(
  //               cfd =>
  //                 cfd.field === filterFieldDef.replace('customFieldsData.', '') &&
  //                 cfd.stringValue?.match(regexer)
  //             )
  //           ) {
  //             return false;
  //           }
  //         } else {
  //           if (!product[filterFieldDef]?.match(regexer)) {
  //             return false;
  //           }
  //         }
  //         return (
  //           (similarityGroups[cm].rules || [])
  //             .map(sg => sg.fieldId)
  //             .filter(sgf => customFieldIds.includes(sgf)).length ===
  //           (similarityGroups[cm].rules || []).length
  //         );
  //       });
  //       if (!matchedMasks.length) {
  //         return {
  //           products: await models.Products.find({ _id })
  //         };
  //       }
  //       const codeRegexs: any[] = [];
  //       const fieldIds: string[] = [];
  //       const groups: { title: string; fieldId: string }[] = [];
  //       for (const matchedMask of matchedMasks) {
  //         const matched = similarityGroups[matchedMask];
  //         const filterFieldDef = matched.filterField || 'code';
  //         if (filterFieldDef.includes('customFieldsData.')) {
  //           codeRegexs.push({
  //             $and: [
  //               {
  //                 'customFieldsData.field': filterFieldDef.replace(
  //                   'customFieldsData.',
  //                   ''
  //                 )
  //               },
  //               {
  //                 'customFieldsData.stringValue': {
  //                   $in: [getRegex(matchedMask)]
  //                 }
  //               }
  //             ]
  //           });
  //         } else {
  //           codeRegexs.push({
  //             [filterFieldDef]: { $in: [getRegex(matchedMask)] }
  //           });
  //         }
  //         for (const rule of similarityGroups[matchedMask].rules || []) {
  //           const { fieldId, title } = rule;
  //           if (!fieldIds.includes(fieldId)) {
  //             fieldIds.push(fieldId);
  //             groups.push({ title, fieldId });
  //           }
  //         }
  //       }
  //       const filters: any = {
  //         $and: [
  //           {
  //             $or: codeRegexs
  //           },
  //           {
  //             'customFieldsData.field': { $in: fieldIds }
  //           }
  //         ]
  //       };
  //       let products = await models.Products.find(filters)
  //         .sort({ code: 1 });
  //       if (!products.length) {
  //         products = [product]
  //       }
  //       return {
  //         products,
  //         groups
  //       };
  //     }
  //     const category = await models.ProductCategories.getProductCategory({
  //       _id: product.categoryId
  //     });
  //     if (!category.isSimilarity || !category.similarities?.length) {
  //       return {
  //         products: await models.Products.find({ _id })
  //       };
  //     }
  //     const fieldIds = category.similarities.map(r => r.fieldId);
  //     const filters: any = {
  //       $and: [
  //         {
  //           categoryId: category._id,
  //           'customFieldsData.field': { $in: fieldIds }
  //         }
  //       ]
  //     };
  //     const groups: {
  //       title: string;
  //       fieldId: string;
  //     }[] = category.similarities.map(r => ({ ...r }));
  //     return {
  //       products: await models.Products.find(filters).sort({ code: 1 }),
  //       groups,
  //     };
  //   },
  //   async productCategories(
  //     _root,
  //     { parentId, withChild, searchValue, status, brand, meta, ids },
  //     { models }: IContext
  //   ) {
  //     const filter = await generateFilterCat({
  //       models,
  //       status,
  //       parentId,
  //       withChild,
  //       searchValue,
  //       brand,
  //       meta,
  //       ids,
  //     });
  //     const sortParams: any = { order: 1 };
  //     return await models.ProductCategories.find(filter).sort(sortParams).lean();
  //   },
  //   async productCategoriesTotalCount(
  //     _root,
  //     { parentId, searchValue, status, withChild, brand, meta, ids },
  //     { models }: IContext
  //   ) {
  //     const filter = await generateFilterCat({
  //       models,
  //       parentId,
  //       withChild,
  //       searchValue,
  //       status,
  //       brand,
  //       meta,
  //       ids,
  //     });
  //     return models.ProductCategories.find(filter).countDocuments();
  //   },
  //   async productDetail(_root, { _id }: { _id: string }, { models }: IContext) {
  //     return models.Products.findOne({ _id }).lean();
  //   },
  //   async productCategoryDetail(
  //     _root,
  //     { _id }: { _id: string },
  //     { models }: IContext
  //   ) {
  //     return models.ProductCategories.findOne({ _id }).lean();
  //   },
  //   async productCountByTags(_root, _params, { models, subdomain }: IContext) {
  //     const counts = {};
  //     const tags = await models.Tags.find({ type: "core:product" }).lean();
  //     for (const tag of tags) {
  //       counts[tag._id] = await models.Products.find({
  //         tagIds: tag._id,
  //         status: { $ne: STATUSES_MAP.DELETED },
  //       }).countDocuments();
  //     }
  //     return counts;
  //   },
  //   async productsCheckUsedPipeline(
  //     _root,
  //     params: IQueryParams & { excludeStageIds },
  //     { commonQuerySelector, models, subdomain, user }: IContext
  //   ) {
  //     const filter = await generateFilter(
  //       subdomain,
  //       models,
  //       commonQuerySelector,
  //       params
  //     );
  //     const {
  //       sortField,
  //       sortDirection,
  //       page,
  //       perPage,
  //       pipelineId,
  //       excludeStageIds,
  //     } = params;
  //     const pagintationArgs = { page, perPage };
  //     let sort: any = { code: 1 };
  //     if (sortField) {
  //       sort = { [sortField]: sortDirection || 1 };
  //     }
  //     const products = await paginate(
  //       models.Products.find(filter).sort(sort).lean(),
  //       pagintationArgs
  //     );
  //     const counterByProductId = {};
  //     for (const product of products) {
  //       product.usedCount = counterByProductId[product._id] || 0;
  //     }
  //     return products;
  //   },
};
