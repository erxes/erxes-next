export const types = `

  type TasksBoard @key(fields: "_id") {
    _id: String!
    name: String!
    order: Int
    createdAt: Date
    type: String
    pipelines: [TasksPipeline]
  }

  type TasksConvertTo {
     dealUrl: String
  }
