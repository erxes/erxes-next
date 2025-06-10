export const types = `

  type TasksPipeline @key(fields: "_id") {
    _id: String!
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
  }

  input TasksOrderItem {
    _id: String!
    order: Int!
  }
`;

export const queries = `
  tasksPipelines(boardId: String, type: String, isAll: Boolean, page: Int, perPage: Int): [TasksPipeline]
  tasksPipelineDetail(_id: String!): TasksPipeline
  tasksPipelineAssignedUsers(_id: String!): [User]
  tasksPipelineStateCount(boardId: String, type: String): JSON
`;

const mutationParams = `
  name: String!,
  boardId: String!,
  type: String!,
  stages: JSON,
  visibility: String!,
  memberIds: [String],
  tagId: String,
  bgColor: String,
  startAt: Date,
  endAT: Date,
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
  tasksPipelinesAdd(${mutationParams}): TasksPipeline
  tasksPipelinesEdit(_id: String!, ${mutationParams}): TasksPipeline
  tasksPipelinesUpdateOrder(orders: [OrderItem]): [TasksPipeline]
  tasksPipelinesWatch(_id: String!, isAdd: Boolean, type: String!): TasksPipeline
  tasksPipelinesRemove(_id: String!): JSON
  tasksPipelinesArchive(_id: String!): JSON
  tasksPipelinesCopied(_id: String!): JSON
`;