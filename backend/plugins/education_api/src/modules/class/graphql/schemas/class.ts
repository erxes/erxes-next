export const types = `
    extend type Customer @key(fields: "_id") {
    _id: String! @external
  }
  type Classes {
    _id: String
    courseId: String
    students : [Customer]
    dates: [String]
    startTime : Date
    endTime : Date
    limit: Int
    entries: Int
    createdAt: Date
    updatedAt: Date
  }

  type ClassesResponse {
    list: [Classes]
    totalCount: Int
  }
`;

export const queries = `
  courseClasses(classId: String!, page: Int, perPage: Int): ClassesResponse
`;

const classesCommonParams = `
  name : String
  courseId: String!
  dates: [String]
  startTime: Date
  endTime : Date
  limit : Int
  entries : Int
`;

export const mutations = `
  classAdd(${classesCommonParams}): Classes
  classEdit(_id:String!, ${classesCommonParams}): Classes
  studentAdd(studentId: String!, classId: String!): Classes
  studentRemove(studentId: String!, classId: String!): Classes
`;
