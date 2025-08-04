export const types = `
    extend type User @key(fields: "_id") {
       _id: String @external
    }

    type Team {
        _id: String
        icon: String
        name: String
        description: String
        estimatedType: Int 
        createdAt: Date
        updatedAt: Date

        taskCount: Int
        memberCount: Int
    }

    type TeamMember {
        _id: String
        memberId: String
        teamId: String

        member: User
        role: String
    }
`;

export const queries = `
    getTeam(_id: String!): Team
    getTeams(name: String): [Team]
    getTeamMembers(teamId: String!): [TeamMember]
`;

export const mutations = `
    teamAdd(name: String!, description: String, icon: String!, memberIds: [String]): Team
    teamUpdate(_id: String!, name: String!, description: String, icon: String!, memberIds: [String], estimatedType: Int): Team
    teamRemove(_id: String!): Team
`;
