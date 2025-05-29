export const types = `
  extend type User @key(fields: "_id") {
    _id: String! @external
  }
  type Course {
    _id: String!
    name: String
    categoryId: String
    classId: String
    category : CourseCategory
    class: Classes
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
    limit : Int
    location: String
  }

  type CourseListResponse {
    list: [Course],
    totalCount: Float,
    pageInfo: PageInfo
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
  ids: [String]
  searchValue: String
  sortField: String
  sortDirection: Int
  categoryId: String
  statuses : [String]
  limit: Int
  cursor: String
  direction: CURSOR_DIRECTION
`;

export const queries = `
  courses(${queryParams}): CourseListResponse
  courseDetail(_id: String!): Course
  courseCategories(parentId: String, searchValue: String): [CourseCategory]
  courseCategoriesTotalCount: Int
`;

const mutationParams = `
  name: String!,
  type: String!,
  categoryId: String!,
  description: String,
  attachment: AttachmentInput,
  startDate: Date!,
  endDate: Date,
  deadline: Date,
  unitPrice: Float!,
  status: String
  limit : Int
  classId: String!
  location: String
`;

export const mutations = `
  courseAdd(${mutationParams}): Course
  courseEdit(_id:String!, ${mutationParams}): Course
  courseRemove(courseIds: [String]): JSON
  changeCourseStatus(_id:String!, status : StatusType): Course
  
  courseCategoryAdd(${courseCategoryParams}): CourseCategory
  courseCategoryEdit(_id: String!, ${courseCategoryParams}): CourseCategory
  courseCategoryRemove(_id: String!): JSON
`;
