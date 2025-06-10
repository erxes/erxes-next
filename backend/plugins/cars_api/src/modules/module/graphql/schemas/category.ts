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
`;

export const queries = `
    getCarCategory(_id: String!): carCategory
    getCarCategories: [carCategory]
    getCarCategoriesCount: Int
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
    createCarCategory(${mutationParams}): carCategory
    updateCarCategory(_id: String!, ${mutationParams}): carCategory
    removeCarCategory(_id: String!): carCategory
`;
