export const BrandTypes = ` 
    type Brand @key(fields: "_id") @cacheControl(maxAge: 3) {
        _id: ID!
        name: String
        description: String
        code: String
        userId: String
        createdAt: Date
        emailConfig: JSON
        memberIds: [String]
    } 
  `;
