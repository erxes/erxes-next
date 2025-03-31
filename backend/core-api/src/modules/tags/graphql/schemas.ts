export const types = `
  type Tag {
    _id: String!
    name: String
    type: String
    colorCode: String
    createdAt: Date
    objectCount: Int
    totalObjectCount: Int
    parentId: String
    order: String
    relatedIds: [String]
  }
`;

const queryParams = `
    type: String,
    searchValue: String,
    tagIds: [String],
    parentId: String,
    ids: [String],
    excludeIds: Boolean,
    page: Int,
    perPage: Int
`;

export const queries = `
  tagsGetTypes: [JSON]
  tags(${queryParams}): [Tag]
  tagDetail(_id: String!): Tag
  tagsQueryCount(type: String, searchValue: String): Int
`;

const mutationParams = `
  name: String!,
  type: String!,
  colorCode: String,
  parentId: String,
`;

export const mutations = `
  tagsAdd(${mutationParams}): Tag
  tagsEdit(_id: String!, ${mutationParams}): Tag
  tagsRemove(_id: String!): JSON
  tagsMerge(sourceId: String!, destId: String!): Tag
`;
