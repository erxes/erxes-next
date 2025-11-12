import { types } from "~/modules/aiassistant/graphql/schema";

export const systemPromptTypeDefs = `
  type SystemPrompt {
    _id: ID
    userId: String
    prompt: String
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    getSystemPrompt: SystemPrompt
  }

  extend type Mutation {
    updateSystemPrompt(prompt: String!): SystemPrompt
  }
`;

export const typeDefs = [systemPromptTypeDefs];