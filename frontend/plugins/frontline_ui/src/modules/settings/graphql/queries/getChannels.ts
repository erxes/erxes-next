import { gql } from '@apollo/client';

const GET_CHANNELS = gql`
  query Channels($page: Int, $perPage: Int, $memberIds: [String]) {
    channels(page: $page, perPage: $perPage, memberIds: $memberIds) {
      _id
      conversationCount
      description
      memberIds
      name
      openConversationCount
      userId
      integrationIds
    }
    channelsTotalCount
  }
`;

export { GET_CHANNELS };
