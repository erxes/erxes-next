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
   getStatusesChoicesByTeam(teamId: String!): JSON
   getStatusesByType(type: String!, teamId: String!): [Status]
`;

export const mutations = `
    addStatus(name: String!, teamId: String!, description: String, color: String, order: Int, type: String): Status
    updateStatus(_id: String!, name: String, description: String, color: String, order: Int, type: String): Status
    deleteStatus(_id: String!): JSON
`;
