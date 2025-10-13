import { gql } from '@apollo/client';

export const RAG_INTERACTIONS = gql`
  query RagInteractions($userId: String, $orgId: String, $limit: Int) {
    ragInteractions(userId: $userId, orgId: $orgId, limit: $limit) {
      _id
      question
      answer
      sourceDocuments
      userId
      orgId
      createdAt
    }
  }
`;