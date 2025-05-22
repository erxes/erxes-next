export const types = `
  type Teacher {
    _id: String
    userId: String
    user: User
  }

  type TeacherResponse {
    list: [Teacher]
    totalCount: Int
    pageInfo: PageInfo
  }
`;

const queryParams = `
  page: Int, 
  perPage: Int,
  cursor: String
  direction: CURSOR_DIRECTION
`;

export const queries = `
  teachers(${queryParams}): TeacherResponse
`;

const mutationParams = `
  userId: String,
`;

export const mutations = `
  teacherAdd(${mutationParams}): Teacher
  teacherRemove(_id: String!): JSON
`;
