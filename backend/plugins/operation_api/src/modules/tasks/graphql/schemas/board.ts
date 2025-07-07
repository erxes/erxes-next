const typeDeps = `
  type TasksBoardCount {
    _id: String
    name: String
    count: Int
  }
`;

export const types = `

  ${typeDeps}

  type TasksBoard @key(fields: "_id") {
    _id: String!
    name: String!
    order: Int
    createdAt: Date
    type: String
    pipelines: [TasksPipeline]
  }
`;

export const queries = `
  tasksBoards: [TasksBoard]
  tasksBoardCounts: [TasksBoardCount]
  tasksBoardGetLast: TasksBoard
  tasksBoardDetail(_id: String!): TasksBoard
`;

export const mutations = `
  tasksBoardsAdd(name: String!): TasksBoard
  tasksBoardsEdit(_id: String!, name: String!): TasksBoard
  tasksBoardsRemove(_id: String!): JSON
`;
