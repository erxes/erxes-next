import { gql } from "@apollo/client";

export const UPDATE_GENERAL_SETTINGS = gql`
  mutation UpdateGeneralSettings(
    $orgId: String!
    $assistantName: String!
    $conversationStarter: String!
    $description: String!
    $promptSuggestions: [String!]
  ) {
    updateGeneralSettings(
      orgId: $orgId
      input: {
        assistantName: $assistantName
        conversationStarter: $conversationStarter
        description: $description
        promptSuggestions: $promptSuggestions
      }
    ) {
      message
      success
      settings {
        assistantName
        conversationStarter
        description
        promptSuggestions
      }
    }
  }
`;
