import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
type Project {
    _id: ID
    name: String
    icon: String
    description: String
    status: Int
    priority: Int
    teamIds: [String]!
    leadId: String
    startDate: Date
    targetDate: Date
    createdAt: Date
    updatedAt: Date
}


type ProjectListResponse {
    list: [Project],
    pageInfo: PageInfo
    totalCount: Int,
}

input IProjectFilter {
    _id: ID
    name: String
    description: String
    status: Int
    priority: Int
    teamIds: [String]
    leadId: String
    startDate: Date
    targetDate: Date
    userId: String
    active: Boolean
    taskId: String
    ${GQL_CURSOR_PARAM_DEFS}
}

type ProjectSubscription {
    type: String
    project: Project
}
`;

const createProjectParams = `
  name: String!
  leadId: String
  icon: String
  description: String
  status: Int
  priority: Int
  teamIds: [String!]!
  startDate: Date
  targetDate: Date
`;

const updateProjectParams = `
  _id: ID!
  name: String
  leadId: String
  icon: String
  description: String
  status: Int
  priority: Int
  teamIds: [String]
  startDate: Date
  targetDate: Date
`;

export const queries = `
    getProject(_id: ID!): Project
    getProjects(filter: IProjectFilter): ProjectListResponse
    getProjectProgress(_id: ID!): JSON
    getProjectProgressByMember(_id: ID!): JSON
    getProjectProgressByTeam(_id: ID!): JSON
    getProjectProgressChart(_id: ID!): JSON
`;

export const mutations = `
  createProject(${createProjectParams}): Project
  updateProject(${updateProjectParams}): Project
  removeProject(_id: ID!): JSON
`;
