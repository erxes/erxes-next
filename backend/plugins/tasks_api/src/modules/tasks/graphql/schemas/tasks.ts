export const types = `
  type Tasks {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getTasks(_id: String!): Tasks
  getTaskss: [Tasks]
`;

export const mutations = `
  createTasks(name: String!): Tasks
  updateTasks(_id: String!, name: String!): Tasks
  removeTasks(_id: String!): Tasks
`;
