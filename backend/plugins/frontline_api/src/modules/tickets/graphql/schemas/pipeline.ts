export const types = `
  type TicketsPipeline @key(fields: "_id") {
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
  ticketsPipelines(boardId: String, isAll: Boolean): [TicketsPipeline]
  ticketsPipelineDetail(_id: String!): TicketsPipeline
  ticketsPipelineAssignedUsers(_id: String!): [User]
  ticketsPipelineStateCount(boardId: String): JSON
`;

const mutationParams = `
  name: String!,
  type: String!

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
  departmentIds: [String],
  nameConfig: String,
  branchIds: [String],
`;

export const mutations = `
  ticketsPipelinesAdd(${mutationParams}): TicketsPipeline
  ticketsPipelinesEdit(_id: String!, ${mutationParams}): TicketsPipeline
  ticketsPipelinesUpdateOrder(orders: [TicketsOrderItem]): [TicketsPipeline]
  ticketsPipelinesWatch(_id: String!, isAdd: Boolean, type: String!): TicketsPipeline
  ticketsPipelinesRemove(_id: String!): JSON
  ticketsPipelinesArchive(_id: String!): JSON
  ticketsPipelinesCopied(_id: String!): JSON
`;
