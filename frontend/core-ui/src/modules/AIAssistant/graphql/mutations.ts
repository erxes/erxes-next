import { gql } from '@apollo/client';

export const RAG_UPLOAD_FILE = gql`
  mutation RagUploadFile($file: Upload!, $orgId: String) {
    ragUploadFile(file: $file, orgId: $orgId) {
      message
      org_id
    }
  }
`;

export const RAG_ASK_QUESTION = gql`
  mutation RagAskQuestion($question: String!, $orgId: String!, $topK: Int) {
    ragAskQuestion(question: $question, orgId: $orgId, topK: $topK) {
      answer
      sourceDocuments
      orgId
    }
  }
`;