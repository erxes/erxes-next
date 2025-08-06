import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
type Project {
    _id: String
    name: String
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
    ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
    getProject(_id: String!): Project
    getProjects(${projectFilterParams}): ProjectListResponse
`;

export const mutations = `
    createProject(name: String!, description: String!, status: Int, teamIds: [String]!, priority: Int, startDate: Date, targetDate: Date): Project
    updateProject(_id: String!, name: String!, description: String!, status: Int, priority: Int, teamIds: [String]!, startDate: Date, targetDate: Date): Project
    removeProject(_id: String!): JSON
`;
