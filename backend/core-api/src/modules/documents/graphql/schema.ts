export const types = `
  type Document {
    _id: String!
    code: String

    createdAt: Date
    createdUserId: String

    contentType: String!
    subType: String
    name: String!
    content: String
    replacer: String
  }

  type DocumentEditorAttribute {
    value: String
    name: String
  }

  type DocumentsTypes {
    label: String
    contentType: String
    subTypes: [String]
  }

  type DocumentListResponse {
    list: [Document]
    pageInfo: PageInfo
    totalCount: Int
  }

`;

const queryParams = `
  limit: Int,
  searchValue: String,
  contentType: String,
  subType: String

  cursor: String
  direction: CURSOR_DIRECTION
`;

export const queries = `
  documents(${queryParams}): DocumentListResponse
  documentsDetail(_id: String!): Document
  documentsGetEditorAttributes(contentType: String!): [DocumentEditorAttribute]
  documentsGetContentTypes:[DocumentsTypes]
  documentsTotalCount(searchValue: String, contentType: String): Int
`;

const mutationParams = `
  _id: String,
  contentType: String, 
  subType: String, 
  name: String!, 
  content: String, 
  replacer: String, 
  code: String
`;

export const mutations = `
  documentsSave(${mutationParams}): Document
  documentsRemove(_id: String!): JSON
`;
