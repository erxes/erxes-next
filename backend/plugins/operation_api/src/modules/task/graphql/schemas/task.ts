import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type Task {
    _id: String
    name: String
    description: String
    status: String
    priority: Int
    labelIds: [String]
    tagIds: [String]
    assigneeId: String
    createdBy: String
    createdAt: Date
    updatedAt: Date
    cycleId: String
    projectId: String
    teamId: String
    estimatedPoint: Int
  }

  type TaskListResponse {
    list: [Task],
    pageInfo: PageInfo
    totalCount: Int,
  }

  input CreateTaskInput {
    name: String!
    description: String
    teamId: String!
    status: String
    priority: Int
    labelIds: [String]
    tagIds: [String]
    assigneeId: String
    cycleId: String
    projectId: String
    estimatedPoint: Int
  
  }

  input UpdateTaskInput {
    _id: String!
    name: String
    description: String
    teamId: String!
    status: String
    priority: Int
    labelIds: [String]
    tagIds: [String]
    assigneeId: String
    cycleId: String
    projectId: String
    estimatedPoint: Int
  }
    
`;

const taskFilterParams = `
  status: String
  priority: Int
  assigneeId: String
  createdBy: String
  cycleId: String
  labelIds: [String]
  tagIds: [String]
  createdAt: Date
  updatedAt: Date
  projectId: String 
  teamId: String
  estimatedPoint: Int
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  getTask(_id: String!): Task
  getTasks(${taskFilterParams}): TaskListResponse
`;

export const mutations = `
  createTask(input: CreateTaskInput!): Task
  updateTask(input: UpdateTaskInput!): Task
  removeTask(_id: String!): Task
`;
