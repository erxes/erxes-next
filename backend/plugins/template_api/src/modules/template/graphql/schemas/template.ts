export const types = `
 
type relatedContent {
  contentType:String
  content:[String]
}


  type Template {
    _id: String
    name: String
    description: String
    contentType:String
    relatedType:[relatedContent]
    categoryId:[String]
    createdAt:Date
    createdBy:String
    updatedAt:String!  
    updatedBy:String
  }
`;

export const queries = `
  getTemplate(_id: String!): Template
  getTemplates: [Template]
`;

export const mutations = `
  createTemplate(name: String!): Template
  updateTemplate(_id: String!, name: String!): Template
  removeTemplate(_id: String!): Template
`;
