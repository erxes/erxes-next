export const graphqlAttachmentType = `
  type Attachment {
    url: String!
    name: String
    type: String
    size: Float
    duration: Float
  }
`;

export const graphqlAttachmentInput = `
  input AttachmentInput {
    url: String!
    name: String!
    type: String
    size: Float
    duration: Float
  }
`;

export const graphqlPdfAttachmentType = `
  type PdfAttachment {
    pdf: Attachment
    pages: [Attachment]
  }
`;

export const graphqlPdfAttachmentInput = `
  input PdfAttachmentInput {
    pdf: AttachmentInput
    pages: [AttachmentInput]
  }
`;

export const graphqlPaginationParams = `
  page: Int,
  perPage: Int,
  sortField: String
  sortDirection: Int
`;
