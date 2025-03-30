import { gql } from '@apollo/client';

export const GET_CHANNELS = gql`
  query channels($memberIds: [String]) {
    channels(memberIds: $memberIds) {
      _id
      name
    }
    channelsTotalCount
  }
`;

export const GET_CHANNEL_BY_ID = gql`
  query channelDetail($_id: String!) {
    channelDetail(_id: $_id) {
      _id
      name
    }
  }
`;
