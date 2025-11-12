import { gql } from "@apollo/client";

export const GET_GENERAL_SETTINGS = gql`
  query GetGeneralSettings($orgId: String!) {
    getGeneralSettings(orgId: $orgId) {
      assistantName
      conversationStarter
      description
      promptSuggestions
    }
  }
`;
