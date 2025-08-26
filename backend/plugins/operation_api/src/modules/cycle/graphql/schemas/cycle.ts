export const types = `
    type Cycle {
        _id: String
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

    input CycleInput {
        _id: String
        name: String
        description: String
        startDate: Date
        endDate: Date
        teamId: String
    }
`;
export const queries = `
    getCycle(_id: String): Cycle
    getCycles(teamId: String): [Cycle]
    getCyclesActive(teamId: String): [Cycle]
`;

export const mutations = `
    createCycle(input: CycleInput): Cycle
    updateCycle(input: CycleInput): Cycle
    removeCycle(_id: String): JSON
`;
