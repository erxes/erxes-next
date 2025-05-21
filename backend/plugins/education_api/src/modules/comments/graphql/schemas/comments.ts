export const types = `
  type Comment {
    _id: String
    courseId: String
    parentId: String
    content: String
    childCount: Int
    createdAt: Date
    updatedAt: Date
  }

  type CommentResponse {
    list: [Comment]
    totalCount: Int
  }
`;

const queryParams = `
  courseId: String!, 
  parentId: String, 
  page: Int, 
  perPage: Int,
  cursor: String
  direction: CURSOR_DIRECTION
`;

export const queries = `
  courseComments(${queryParams}): CommentResponse
  courseCommentCount(courseId: String!): Int
`;

const mutationParams = `
  courseId: String!
  content: String!
  parentId: String
`;

export const mutations = `
  courseCommentAdd(${mutationParams}): Comment
  courseCommentEdit(_id: String, ${mutationParams}): Comment
  courseCommentRemove(_id: String!): JSON
`;
