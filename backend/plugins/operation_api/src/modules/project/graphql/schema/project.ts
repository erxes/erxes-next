import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
type Project {
    _id: String
    name: String
    description: String
    teamId: String!
    startDate: Date
    endDate: Date
    createdAt: Date
    updatedAt: Date
}

input ProjectInput {
    name: String
    description: String
    teamId: String!
    startDate: Date
    endDate: Date
    ${GQL_CURSOR_PARAM_DEFS}
}  

type ProjectListResponse {
    list: [Project],
    pageInfo: PageInfo
    totalCount: Int,
}

`;

export const queries = `
    getProject(_id: String!): Project
    getProjectsByTeam(teamId: String!, PROJECT_INPUT): [Project]
    getMyProjects(PROJECT_INPUT): ProjectListResponse
    getProjects(PROJECT_INPUT): ProjectListResponse
`;

export const mutations = `
    createProject(name: String!, description: String!, teamId: String!, startDate: Date, endDate: Date): Project
    updateProject(_id: String!, name: String!, description: String!, teamId: String!, startDate: Date, endDate: Date): Project
    removeProject(_id: String!): Project
`;
