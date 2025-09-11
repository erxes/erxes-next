export const types = `
    type Note {
        _id: ID
        content: String
        itemId: String
        createdBy: String
        mentions: [String]

        createdAt: String
        updatedAt: String
    }
`;

const createNoteParams = `
    content: String
    itemId: String
    mentions: [String]
`;

const updateNoteParams = `
    _id: ID!
    content: String
    itemId: String
    mentions: [String]
`;

export const queries = `
    getNote(_id: ID!): Note
`;

export const mutations = `
    createNote(${createNoteParams}): Note
    updateNote(${updateNoteParams}): Note
    deleteNote(_id: ID!): JSON
`;
