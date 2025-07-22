const inputDeps = `
 input TasksOrderItem {
    _id: String!
    order: Int!
  }
`;

export const types = `

  ${inputDeps}

  type TasksStage @key(fields: "_id") {
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
    unusedAmount: JSON
    amount: JSON
    itemsTotalCount: Int
    compareNextStageTasks: JSON
    stayedTasksTotalCount: Int
    initialTasksTotalCount: Int
    inProcessTasksTotalCount: Int
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
  tasksStages(
    isNotLost: Boolean,
    isAll: Boolean,
    pipelineId: String,
    pipelineIds: [String],
    ${queryParams}
  ): [TasksStage]
  tasksStageDetail(_id: String!, ${queryParams}): TasksStage
  tasksArchivedStages(pipelineId: String!, search: String): [TasksStage]
  tasksArchivedStagesCount(pipelineId: String!, search: String): Int
`;

export const mutations = `
  tasksStagesUpdateOrder(orders: [TasksOrderItem]): [TasksStage]
  tasksStagesRemove(_id: String!): JSON
  tasksStagesEdit(_id: String!, name: String, status: String): TasksStage
  tasksStagesSortItems(stageId: String!, proccessId: String, sortType: String): String
`;
