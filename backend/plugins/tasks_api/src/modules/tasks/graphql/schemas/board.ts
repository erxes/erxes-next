export const types = `

  type TasksBoard @key(fields: "_id") {
    _id: String!
    name: String!
    order: Int
    createdAt: Date
    type: String
    pipelines: [SalesPipeline]
  }

  type TasksConvertTo {
    dealUrl: String
  }

  type TasksBoardCount {
    _id: String
    name: String
    count: Int
  }

  input TasksInterval {
    startTime: Date
    endTime: Date
  }
`;

export const queries = `
  tasksBoards: [TasksBoard]
  tasksBoardCounts(type: String!): [TasksBoardCount]
  tasksBoardGetLast(type: String!): TasksBoard
  tasksBoardDetail(_id: String!): TasksBoard
  tasksConvertToInfo(conversationId: String!): TasksConvertTo
  tasksItemsCountByAssignedUser(type: String!, pipelineId: String!, stackBy: String): JSON
  tasksCardsFields: JSON
  tasksBoardContentTypeDetail(contentType: String, contentId: String): JSON
  tasksBoardLogs(action: String, content:JSON, contentId: String, contentType: String): JSON
  tasksCheckFreeTimes(pipelineId: String, intervals: [SalesInterval]): JSON
`;

const mutationParams = `
  name: String!,
  type: String!
`;

export const mutations = `
  tasksBoardsAdd(${mutationParams}): TasksBoard
  tasksBoardsEdit(_id: String!, ${mutationParams}): TasksBoard
  tasksBoardsRemove(_id: String!): JSON
  tasksBoardItemUpdateTimeTracking(_id: String!, type: String!, status: String!, timeSpent: Int!, startDate: String): JSON
  tasksBoardItemsSaveForGanttTimeline(items: JSON, links: JSON, type: String!): String
`;
