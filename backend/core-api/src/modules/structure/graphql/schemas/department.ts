export const DepartmentTypes = `
    type Department @key(fields: "_id") @cacheControl(maxAge: 3) {
          _id: String!
          title: String
          description: String
          parentId: String
          supervisorId: String
          supervisor: User
          code: String
          order:String
          parent: Department
          children: [Department]
          childCount: Int
          users: [User]
          userCount: Int
          userIds: [String]
          workhours:JSON
      }
  `;
