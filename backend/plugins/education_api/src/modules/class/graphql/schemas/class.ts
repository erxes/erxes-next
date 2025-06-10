export const types = `
  type Classes {
    _id: String
    name: String
    description: String
    location: String
    level: String
    createdAt: Date
    updatedAt: Date
  }

  type ClassesResponse {
    list: [Classes]
    totalCount: Int
    pageInfo: PageInfo
  }
`;

export const queries = `
  courseClasses(page: Int, perPage: Int, limit: Int, cursor: String, direction: CURSOR_DIRECTION): ClassesResponse
`;

const classesCommonParams = `
  name : String
  description : String
  location : String
  level: String,
`;

export const mutations = `
  classAdd(${classesCommonParams}): Classes
  classEdit(_id:String!, ${classesCommonParams}): Classes
  classesRemove(classIds: [String]): JSON
`;
