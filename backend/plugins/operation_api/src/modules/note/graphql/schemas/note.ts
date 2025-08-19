export const types = `
    type Note {
        _id: String
        content: String
        itemId: String
        userId: String
    }
`;

const createNoteParams = `
    content: String!
    itemId: String!
    userId: String!
`;

const updateNoteParams = `
    _id: String!
    content: String
    itemId: String
    userId: String
`;

export const queries = `
    getNote(_id: String!): Note
`;

export const mutations = `
    createNote(${createNoteParams}): Note
    updateNote(${updateNoteParams}): Note
    deleteNote(_id: String!): JSON
`;
