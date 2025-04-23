import { gql } from '@apollo/client';

export const CONVERSATION_CHANGED = gql`
  subscription conversationChanged($_id: String!) {
    conversationChanged(_id: $_id) {
      type
    }
  }
`;

export const CONVERSATION_MESSAGE_INSERTED = gql`
  subscription conversationMessageInserted($_id: String!) {
    conversationMessageInserted(_id: $_id) {
      _id
      content
      formWidgetData
      attachments {
        name
        type
        url
      }
      internal
      createdAt
      isCustomerRead
      userId
      customerId
    }
  }
`;

const conversationClientMessageInserted = `
  subscription conversationClientMessageInserted($userId: String!) {
    conversationClientMessageInserted(userId: $userId) {
      _id
      content
    }
  }
`;

const conversationClientTypingStatusChanged = `
  subscription conversationClientTypingStatusChanged($_id: String!) {
    conversationClientTypingStatusChanged(_id: $_id) {
      text
    }
  }
`;

const conversationExternalIntegrationMessageInserted = `
  subscription conversationExternalIntegrationMessageInserted {
    conversationExternalIntegrationMessageInserted
  }
`;

const customerConnectionChanged = `
  subscription customerConnectionChanged ($_id: String!) {
    customerConnectionChanged (_id: $_id) {
      _id
      status
    }
  }
`;

export default {
  conversationClientMessageInserted,
  conversationClientTypingStatusChanged,
  conversationExternalIntegrationMessageInserted,
  customerConnectionChanged,
};
