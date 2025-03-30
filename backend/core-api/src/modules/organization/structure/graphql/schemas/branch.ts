export const BranchTypes = ` 
      type Branch @key(fields: "_id") @cacheControl(maxAge: 3){
          _id: String!
          title: String
          parentId: String
          supervisorId: String
          supervisor: User
          code: String
          order:String
          users: [User]
          userIds: [String]
          userCount: Int
          parent: Branch
          children: [Branch]
          status:String
  
          address: String
          radius: Int
          hasChildren:Boolean
          workhours:JSON
          phoneNumber: String
          email: String
          links: JSON
          coordinate: Coordinate
          image: Attachment
      }
  `;
