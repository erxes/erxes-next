import { ragInteractionFields } from '../db/definitions/ragInteractions';

export const types = `
  type RagUploadResponse {
    message: String!
    userId: String!
  }

  type RagAskResponse {
    answer: String!
    sourceDocuments: [String]
    userId: String!
  }

  type RagInteraction {
    _id: String!
    ${ragInteractionFields}
  }

  extend type Mutation {
    ragUploadFile(file: Upload!, userId: String): RagUploadResponse
    ragAskQuestion(question: String!, userId: String!, topK: Int): RagAskResponse
  }

  extend type Query {
    ragHealthCheck: Boolean
  }
`;
