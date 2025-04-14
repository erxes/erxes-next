import { commonParams } from './commonTypeDefs';

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
     type DepartmentListQueryResponse {
        list:[Department]
        totalCount: Int
        totalUsersCount:Int
    }
  `;

const commonDepartmentParams = `
    title: String
    description: String
    supervisorId: String
    code: String
    parentId: String
    userIds: [String]
    workhours: JSON
`;

export const mutations = `
     departments(${commonParams},withoutUserFilter:Boolean): [Department]
     departmentsMain(${commonParams},withoutUserFilter:Boolean):DepartmentListQueryResponse
     departmentDetail(_id: String!): Department
`;

export const queries = `
    departmentsAdd(${commonDepartmentParams}): Department
    departmentsEdit(_id: String!,${commonDepartmentParams}): Department
    departmentsRemove(ids: [String!]): JSON
`;
