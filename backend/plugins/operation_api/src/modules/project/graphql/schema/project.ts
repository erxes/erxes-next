import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
type Project {
    _id: String
    name: String
    description: String
    status: String!
    priority: String
    teamIds: [String]!
    leadId: String
    startDate: Date
    targetDate: Date
    
    status: String

    createdAt: Date
    updatedAt: Date
}

input ProjectFilter {
    name: Strings   
    description: String
    status: String!
    priority: String
    teamIds: [String]!
    leadId: String
    startDate: Date
    targetDate: Date
    ${GQL_CURSOR_PARAM_DEFS}
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
    status: String!
    priority: String
    teamIds: [String]!
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
    createProject(name: String!, description: String!, status: String!, teamIds: [String]!, startDate: Date, endDate: Date): Project
    updateProject(_id: String!, name: String!, description: String!, status: String!, teamIds: [String]!, startDate: Date, endDate: Date): Project
    removeProject(_id: String!): Project
`;
