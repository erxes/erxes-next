export const types = `
    type Status {
        _id: String!
        name: String!
        teamId: String!
        description: String
        color: String,
        order: Int
        type: String
        createdAt: Date
        updatedAt: Date
    }

    input StatusInput {
        _id: String
        name: String!
        teamId: String!
        description: String
        color: String
        type: String
        order: Int
    }
`;

export const queries = `
   getStatus(_id: String!): Status
   getStatusesByTeam(teamId: String!): [Status]
   getStatusesByType(type: String!, teamId: String!): [Status]
`;

export const mutations = `
    addStatus(input: StatusInput!): Status
    updateStatus(_id: String!, name: String, description: String, color: String, order: Int, type: String): Status
    deleteStatus(_id: String!): Status
`;
