import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type Task {
    _id: String
    name: String
    description: String
    status: String
    priority: String
    labelIds: [String]
    tagIds: [String]
    assignee: String
    createdAt: String
    updatedAt: String
    cycleId: String
    projectId: String
  }

  type TaskListResponse {
    list: [Task],
    pageInfo: PageInfo
    totalCount: Int,
  }
`;

const taskFilterParams = `
  status: String
  priority: String
  assignee: String
  cycleId: String
  labelIds: [String]
  tagIds: [String]
  createdAt: String
  updatedAt: String
  projectId: String 
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  getTask(_id: String!): Task
  getTasks(${taskFilterParams}): TaskListResponse
`;

export const mutations = `
  createTask(name: String!, description: String!, status: String!, priority: String!, labelIds: [String], tagIds: [String], assignee: String!, cycleId: String!, projectId: String!): Task
  updateTask(_id: String!, name: String!, description: String!, status: String!, priority: String!, labelIds: [String], tagIds: [String], assignee: String!, cycleId: String!, projectId: String!): Task
  removeTask(_id: String!): Task
`;
