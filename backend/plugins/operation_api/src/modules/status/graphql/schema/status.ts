export const types = `
    type Status {
        _id: ID!
        name: String!
        teamId: String!
        description: String
        color: String,
        order: Int
        type: Int
        createdAt: Date
        updatedAt: Date
    }

    input StatusInput {
        _id: ID
        name: String!
        teamId: String!
        description: String
        color: String
        type: Int
        order: Int
    }
`;

export const queries = `
   getStatus(_id: ID!): Status
   getStatusesChoicesByTeam(teamId: String!): JSON
   getStatusesByType(type: Int!, teamId: String!): [Status]
`;

export const mutations = `
    addStatus(name: String!, teamId: String!, description: String, color: String, order: Int, type: Int): Status
    updateStatus(_id: ID!, name: String, description: String, color: String, order: Int, type: Int): Status
    deleteStatus(_id: ID!): JSON
`;
