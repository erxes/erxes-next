export const systemPrompttypes = () => {
  console.log('Loading system prompt schema types');
  return [
    `
    type SystemPrompt {
      _id: String!
      prompt: String!
      updatedAt: String
    }

    extend type Query {
      getSystemPrompt: SystemPrompt
    }

    extend type Mutation {
      updateSystemPrompt(prompt: String!): SystemPrompt
    }
    `
  ];
};