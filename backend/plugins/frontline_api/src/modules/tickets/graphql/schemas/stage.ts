export const types = `
  type TicketsStage @key(fields: "_id") {
    _id: String!
    name: String!
    pipelineId: String!
    visibility: String
    code: String
    memberIds: [String]
    canMoveMemberIds: [String]
    canEditMemberIds: [String]
    members: [User]
    departmentIds: [String]
    probability: String
    status: String
    unUsedAmount: JSON
    amount: JSON
    itemsTotalCount: Int
    compareNextStageTickets: JSON
    stayedTicketsTotalCount: Int
    initialTicketsTotalCount: Int
    inProcessTicketsTotalCount: Int
    formId: String
    age: Int
    defaultTick: Boolean
    order: Int
    createdAt: Date
    type: String
  }
`;

const queryParams = `
  search: String,
  companyIds: [String]
  customerIds: [String]
  assignedUserIds: [String]
  labelIds: [String]
  extraParams: JSON,
  closeDateType: String,
  assignedToMe: String,
  age: Int,
  branchIds: [String]
  departmentIds: [String]
  segment: String
  segmentData:String
  createdStartDate: Date
  createdEndDate: Date
  stateChangedStartDate: Date
  stateChangedEndDate: Date
  startDateStartDate: Date
  startDateEndDate: Date
  closeDateStartDate: Date
  closeDateEndDate: Date
`;

export const queries = `
  ticketsStages(isNotLost: Boolean, isAll: Boolean, pipelineId: String, pipelineIds: [String], ${queryParams}): [TicketsStage]
  ticketsStageDetail(_id: String!, ${queryParams}): TicketsStage
  ticketsArchivedStages(pipelineId: String!, search: String, page: Int, perPage: Int): [TicketsStage]
  ticketsArchivedStagesCount(pipelineId: String!, search: String): Int
`;

export const mutations = `
  ticketsStagesUpdateOrder(orders: [TicketsOrderItem]): [TicketsStage]
  ticketsStagesRemove(_id: String!): JSON
  ticketsStagesEdit(_id: String!, type: String, name: String, status: String): TicketsStage
  ticketsStagesSortItems(stageId: String!, type: String, proccessId: String, sortType: String): String
`;
