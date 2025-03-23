export const PositionTypes = `
    type Position @key(fields: "_id") @cacheControl(maxAge: 3){
        _id: String!
        title: String
        code: String
        order: String
        parentId: String
        parent: Position
        status: String
        children: [Position]
        users: [User]
        userIds: [String]
        userCount: Int
    }
`;
