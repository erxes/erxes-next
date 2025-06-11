export const types = `
    type carCategory {
    name: String
    code: String
    order: String
    parentId: String
    description: String
    image: Attachment
    secondaryImage: Attachment
    producCategoryId: String
    }

    type carCategoryListResponse {
    list: [carCategory],
    pageInfo: PageInfo
    totalCount: Int,}
`;

export const queries = `
    carCategoryDetail(_id: String!): carCategory
    carCategories: carCategoryListResponse
`;

const mutationParams = `
    name: String!,
    code: String!,
    description: String,
    parentId: String,
    image: AttachmentInput,
    secondaryImages: [AttachmentInput],
    productCategoryId: String
`;

export const mutations = `
    carCategoriesAdd(${mutationParams}): carCategory
    carCategoriesEdit(_id: String!, ${mutationParams}): carCategory
    carCategoriesRemove(_id: String!): carCategory
`;
