import { gql } from "@apollo/client";

export const UPDATE_SYSTEM_PROMPT = gql`
  mutation UpdateSystemPrompt($prompt: String!) {
    updateSystemPrompt(prompt: $prompt) {
      _id
      prompt
      updatedAt
    }
  }
`;