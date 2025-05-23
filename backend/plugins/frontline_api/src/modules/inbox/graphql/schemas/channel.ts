export const types = `
  type  Channel {
    _id: String!
    name: String!
    description: String
    integrationIds: [String]
    memberIds: [String]
    userId: String!
    conversationCount: Int
    openConversationCount: Int
  }
`;

export const queries = `
  channels(page: Int, perPage: Int, memberIds: [String]): [Channel]
  channelsByMembers(memberIds: [String]): [Channel]
  channelDetail(_id: String!): Channel
  channelsTotalCount: Int
  channelsGetLast: Channel
`;

const commonMutationParams = `
  name: String!,
  description: String,
  memberIds: [String],
  integrationIds: [String]
`;

export const mutations = `
  channelsAdd(${commonMutationParams}): Channel
  channelsEdit(_id: String!, ${commonMutationParams}): Channel
  channelsRemove(_id: String!): JSON
`;
