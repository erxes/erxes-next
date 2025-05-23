import { gql } from '@apollo/client';

export const GET_CHANNELS = gql`
  query channelsByMembers($memberIds: [String]) {
    channelsByMembers(memberIds: $memberIds) {
      _id
      name
    }
  }
`;
