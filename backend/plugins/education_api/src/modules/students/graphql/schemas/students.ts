const commonDetailFields = `
  avatar: String
  coverPhoto: String
  fullName: String
  shortName: String
  birthDate: Date
  position: String
  workStartedDate: Date
  location: String
  description: String
  operatorPhone: String
  firstName: String
  middleName: String
  lastName: String
  employeeId: String
`;

export const types = `
  type StudentDetailsType {
    ${commonDetailFields}
  }

  type Student {
    _id: String
    username: String
    email: String
    details: StudentDetailsType
    links: JSON
    isActive: Boolean
    cursor: String
  }

  type StudentListResponse {
    list: [Student]
    totalCount: Int
    pageInfo: PageInfo
  }
`;

const queryParams = `
  page: Int, 
  perPage: Int,
  cursor: String,
  direction: CURSOR_DIRECTION
  searchValue: String,
`;

export const queries = `
  students(${queryParams}): StudentListResponse
`;

export const mutations = `
  studentRemove(_id: String!): JSON
`;
