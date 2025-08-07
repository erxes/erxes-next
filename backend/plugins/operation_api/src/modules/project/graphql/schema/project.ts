import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
type Project {
    _id: String
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

input CreateProjectInput {
  name: String!
  leadId: String
  icon: String
  description: String
  status: Int
  priority: Int
  teamIds: [String!]!
  startDate: Date
  targetDate: Date
}

input UpdateProjectInput {
  _id: String!
  name: String
  leadId: String
  icon: String
  description: String
  status: Int
  priority: Int
  teamIds: [String!]
  startDate: Date
  targetDate: Date
}

`;

const projectFilterParams = `
    name: String
    description: String
    status: Int
    priority: Int
    teamIds: [String]
    leadId: String
    startDate: Date
    targetDate: Date
    userId: String
    ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
    getProject(_id: String!): Project
    getProjects(${projectFilterParams}): ProjectListResponse
`;

export const mutations = `
  createProject(input: CreateProjectInput!): Project
  updateProject(input: UpdateProjectInput!): Project
  removeProject(_id: String!): JSON
`;
