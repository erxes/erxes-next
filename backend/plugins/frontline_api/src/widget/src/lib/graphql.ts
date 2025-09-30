import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations($brandId: String!) {
    conversations(brandId: $brandId) {
      _id
      content
      createdAt
      customer {
        _id
        firstName
        lastName
        email
        phone
      }
      assignedUser {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: String!, $content: String!) {
    sendMessage(conversationId: $conversationId, content: $content) {
      _id
      content
      createdAt
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($brandId: String!, $customerId: String!) {
    createConversation(brandId: $brandId, customerId: $customerId) {
      _id
      content
      createdAt
    }
  }
`;
