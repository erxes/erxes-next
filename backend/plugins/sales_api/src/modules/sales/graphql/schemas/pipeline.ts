import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `

  type SalesPipeline @key(fields: "_id") {
    _id: ID!
    name: String!
    status: String
    boardId: String!
    tagId: String
    tag: Tag
    visibility: String!
    memberIds: [String]
    departmentIds: [String]
    branchIds: [String]
    members: [User]
    bgColor: String
    isWatched: Boolean
    itemsTotalCount: Int
    userId: String
    createdUser: User
    startDate: Date
    endDate: Date
    metric: String
    hackScoringType: String
    templateId: String
    state: String
    isCheckDate: Boolean
    isCheckUser: Boolean
    isCheckDepartment: Boolean
    excludeCheckUserIds: [String]
    numberConfig: String
    numberSize: String
    nameConfig: String
    initialCategoryIds: [String]
    excludeCategoryIds: [String]
    excludeProductIds: [String]
    paymentIds: [String]
    paymentTypes: JSON
    erxesAppToken: String
    order: Int
    createdAt: Date
    type: String

    cursor: String
  }

  type SalesPipelinesListResponse {
    list: [SalesPipeline],
    pageInfo: PageInfo
    totalCount: Int,
  }

  input SalesOrderItem {
    _id: ID!
    order: Int!
  }
`;

const queryParams = `
  boardId: String,
  isAll: Boolean

  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  salesPipelines(${queryParams}): SalesPipelinesListResponse
  salesPipelineDetail(_id: ID!): SalesPipeline
  salesPipelineAssignedUsers(_id: ID!): [User]
  salesPipelineStateCount(boardId: String): JSON
`;

const mutationParams = `
  name: String!,
  boardId: String!,
  stages: JSON,
  visibility: String!,
  memberIds: [String],
  tagId: String,
  bgColor: String,
  startDate: Date,
  endDate: Date,
  metric: String,
  hackScoringType: String,
  templateId: String,
  isCheckDate: Boolean
  isCheckUser: Boolean
  isCheckDepartment: Boolean
  excludeCheckUserIds: [String],
  numberConfig: String,
  numberSize: String,
  nameConfig: String,
  departmentIds: [String],
  branchIds: [String],
  initialCategoryIds: [String]
  excludeCategoryIds: [String]
  excludeProductIds: [String]
  paymentIds: [String]
  paymentTypes: JSON
  erxesAppToken: String
`;

export const mutations = `
  salesPipelinesAdd(${mutationParams}): SalesPipeline
  salesPipelinesEdit(_id: ID!, ${mutationParams}): SalesPipeline
  salesPipelinesUpdateOrder(orders: [SalesOrderItem]): [SalesPipeline]
  salesPipelinesWatch(_id: ID!, isAdd: Boolean): SalesPipeline
  salesPipelinesRemove(_id: ID!): JSON
  salesPipelinesArchive(_id: ID!): JSON
  salesPipelinesCopied(_id: ID!): JSON
`;
