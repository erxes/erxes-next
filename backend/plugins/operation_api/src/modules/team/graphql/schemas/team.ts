export const types = `
    type Team {
        _id: String
        icon: String
        memberIds: [String]
        name: String
        description: String
        createdAt: String
        updatedAt: String
    }
`;

export const queries = `
    getTeam(_id: String!): Team
    getTeamsByMember(memberId: String!): [Team]
    getMyTeams: [Team]
    getTeams: [Team]
`;

export const mutations = `
    teamAdd(name: String!, description: String, icon: String!, memberIds: [String]): Team
    teamUpdate(_id: String!, name: String!, description: String, icon: String!, memberIds: [String]): Team
    teamRemove(_id: String!): Team
`;
