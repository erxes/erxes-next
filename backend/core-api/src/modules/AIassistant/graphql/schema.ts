import { ragInteractionFields } from '../db/definitions/ragInteractions';

export const types = () => [
  `
  type RagUploadResponse {
    message: String!
    org_id: String!
  }

  type RagAskResponse {
    answer: String!
    sourceDocuments: [String]
    orgId: String!
  }

  type RagInteraction {
    _id: String!
    ${ragInteractionFields}
  }

  extend type Mutation {
    ragUploadFile(file: Upload!, orgId: String): RagUploadResponse
    ragAskQuestion(question: String!, orgId: String!, topK: Int): RagAskResponse
  }

  extend type Query {
    ragHealthCheck: Boolean
  }
  `
];