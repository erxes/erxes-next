export const types = `
    extend type User @key(fields: "_id") {
       _id: ID @external
    }

    type Team {
        _id: ID
        icon: String
        name: String
        description: String
        estimateType: Int 
        createdAt: Date
        updatedAt: Date
        cycleEnabled: Boolean

        taskCount: Int
        memberCount: Int
    }

    type TeamMember {
        _id: ID
        memberId: String
        teamId: String

        member: User
        role: String
    }
`;

export const queries = `
    getTeam(_id: ID!): Team
    getTeams(name: String, userId: String, teamIds: [String], projectId: String): [Team]
    getTeamMembers(teamId: String, teamIds: [String]): [TeamMember]
    getTeamEstimateChoises(teamId: String): JSON
`;

export const mutations = `
    teamAdd(name: String!, description: String, icon: String!, memberIds: [String]): Team
    teamUpdate(_id: ID!, name: String, description: String, icon: String, memberIds: [String], estimateType: Int, cycleEnabled: Boolean): Team
    teamRemove(_id: ID!): Team
    teamAddMembers(_id: ID!, memberIds: [String]): [TeamMember]
    teamRemoveMember(_id: ID!): TeamMember
    teamUpdateMember(_id: ID!, role: String): TeamMember
`;
