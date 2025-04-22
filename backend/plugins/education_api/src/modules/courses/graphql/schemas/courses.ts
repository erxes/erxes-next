export const types = `
  extend type User @key(fields: "_id") {
    _id: String! @external
  }
  type Course {
    _id: String!
    name: String
    code: String
    categoryId: String
    description: String
    createdAt: Date
    type: String
    attachment: Attachment
    status: String
    startDate: Date,
    endDate: Date,
    deadline: Date,
    unitPrice: Float,
    commentCount: Int
    primaryTeacher: User
    teachers : [User]
  }

  type CourseListResponse {
    list: [Course],
    totalCount: Float,
  }
    
  type CourseCategory {
    _id: String!
    name: String
    description: String
    parentId: String
    code: String!
    order: String!
    isRoot: Boolean
    courseCount: Int
    attachment: Attachment
  }
  enum StatusType {
    active
    draft
  }
`;

const courseCategoryParams = `
  name: String!,
  code: String!,
  description: String,
  parentId: String,
  attachment: AttachmentInput,
`;

const queryParams = `
  page: Int
  perPage: Int
  categoryId: String
  ids: [String]
  searchValue: String
  sortField: String
  sortDirection: Int
  categoryId: String
  statuses : [String]
`;

export const queries = `
  courses(${queryParams}): CourseListResponse
  courseDetail(_id: String!): Course
  courseCategories(parentId: String, searchValue: String): [CourseCategory]
  courseCategoriesTotalCount: Int
`;

const mutationParams = `
  name: String!,
  code: String!,
  type: String,
  categoryId: String!,
  description: String,
  attachment: AttachmentInput,
  startDate: Date!,
  endDate: Date,
  deadline: Date,
  unitPrice: Float!,
  status: String
`;

export const mutations = `
  courseAdd(${mutationParams}): Course
  courseEdit(_id:String!, ${mutationParams}): Course
  activitiesRemove(courseIds: [String]): JSON
  changeCourseStatus(_id:String!, status : StatusType): Course
  
  courseCategoryAdd(${courseCategoryParams}): CourseCategory
  courseCategoryEdit(_id: String!, ${courseCategoryParams}): CourseCategory
  courseCategoryRemove(_id: String!): JSON
`;
