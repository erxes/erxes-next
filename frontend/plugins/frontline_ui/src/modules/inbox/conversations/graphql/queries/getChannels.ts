import { gql } from '@apollo/client';

export const GET_CHANNELS_BY_MEMBERS = gql`
  query channelsByMembers($memberIds: [String]) {
    channelsByMembers(memberIds: $memberIds) {
      _id
      name
    }
  }
`;

export const GET_CHANNELS = gql`
  query getChannels(
    $name: String
    $userId: String
    $channelIds: [String]
    $integrationId: String
  ) {
    getChannels(
      name: $name
      userId: $userId
      channelIds: $channelIds
      integrationId: $integrationId
    ) {
      _id
      icon
      name
      description
      createdAt
      updatedAt
      memberCount
    }
  }
`;
