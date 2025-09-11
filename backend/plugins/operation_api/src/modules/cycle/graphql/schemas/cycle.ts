import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
    type Cycle {
        _id: ID
        name: String
        description: String
        startDate: Date
        endDate: Date
        teamId: String
        isCompleted: Boolean
        isActive: Boolean
        statistics: JSON
        donePercent: Int
        unFinishedTasks: [String]
    }

    type CycleListResponse {
        list: [Cycle],
        pageInfo: PageInfo
        totalCount: Int,
    }

    input CycleInput {
        _id: ID
        name: String
        description: String
        startDate: Date
        endDate: Date
        teamId: String
    }
`;
export const queries = `
    getCycle(_id: ID): Cycle
    getCycles(teamId: String, ${GQL_CURSOR_PARAM_DEFS}): CycleListResponse
    getCyclesActive(teamId: String,taskId: String, ${GQL_CURSOR_PARAM_DEFS}): CycleListResponse
    getCycleProgress(_id: ID!, assigneeId: String): JSON
    getCycleProgressChart(_id: ID!, assigneeId: String): JSON
    getCycleProgressByMember(_id: ID!, assigneeId: String): JSON
    getCycleProgressByProject(_id: ID!, assigneeId: String): JSON
`;

export const mutations = `
    createCycle(input: CycleInput): Cycle
    updateCycle(input: CycleInput): Cycle
    removeCycle(_id: ID): JSON
`;
