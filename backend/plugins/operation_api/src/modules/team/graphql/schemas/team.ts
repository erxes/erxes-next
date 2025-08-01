export const types = `
    type Team {
        _id: String
        icon: String
        memberIds: [String]
        name: String
        description: String
        createdAt: Date
        updatedAt: Date

        taskCount: Int
    }
`;

export const queries = `
    getTeam(_id: String!): Team
    getTeams(name: String): [Team]
`;

export const mutations = `
    teamAdd(name: String!, description: String, icon: String!, memberIds: [String]): Team
    teamUpdate(_id: String!, name: String!, description: String, icon: String!, memberIds: [String]): Team
    teamRemove(_id: String!): Team
`;
