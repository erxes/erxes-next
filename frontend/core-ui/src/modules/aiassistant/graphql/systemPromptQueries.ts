import { gql } from "@apollo/client";

export const GET_SYSTEM_PROMPT = gql`
  query GetSystemPrompt {
    getSystemPrompt {
      prompt
      userId
    }
  }
`;
