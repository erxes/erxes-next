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
    order: Int
    createdAt: Date
    type: String
  }
`;

export const queries = `
  tasksPipelines(boardId: String, isAll: Boolean): [TasksPipeline]
  tasksPipelineDetail(_id: String!): TasksPipeline
  tasksPipelineAssignedUsers(_id: String!): [User]
  tasksPipelineStateCount(boardId: String): JSON
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
  isCheckDate: Boolean,
  isCheckUser: Boolean,
  isCheckDepartment: Boolean,
  excludeCheckUserIds: [String],
  numberConfig: String,
  numberSize: String,
  nameConfig: String,
  departmentIds: [String],
  branchIds: [String],
`;

export const mutations = `
  tasksPipelinesAdd(${mutationParams}): TasksPipeline
  tasksPipelinesEdit(_id: String!, ${mutationParams}): TasksPipeline
  tasksPipelinesUpdateOrder(orders: [TasksOrderItem]): [TasksPipeline]
  tasksPipelinesWatch(_id: String!, isAdd: Boolean, type: String!): TasksPipeline
  tasksPipelinesRemove(_id: String!): JSON
  tasksPipelinesArchive(_id: String!): JSON
  tasksPipelinesCopied(_id: String!): JSON
`;
