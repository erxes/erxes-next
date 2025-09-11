const conversationChanged = `
  subscription conversationChanged($_id: ID!) {
    conversationChanged(_id: $_id) {
      type
    }
  }
`;

const conversationMessageInserted = `
  subscription conversationMessageInserted($_id: ID!) {
    conversationMessageInserted(_id: $_id) {
      _id
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
  subscription conversationClientTypingStatusChanged($_id: ID!) {
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
  subscription customerConnectionChanged ($_id: ID!) {
    customerConnectionChanged (_id: $_id) {
      _id
      status
    }
  }
`;

const callReceived = `
subscription phoneCallReceived($userId: String) {
  phoneCallReceived(userId: $userId) 
  }`;

const callWaitingReceived = `
subscription waitingCallReceived($extension: String) {
  waitingCallReceived(extension: $extension)
  }`;

const callTalkingReceived = `
subscription talkingCallReceived($extension: String) {
  talkingCallReceived(extension: $extension)
  }`;

const callAgentReceived = `
subscription agentCallReceived($extension: String) {
  agentCallReceived(extension: $extension)
  }`;

export default {
  conversationChanged,
  conversationMessageInserted,
  conversationClientMessageInserted,
  conversationClientTypingStatusChanged,
  conversationExternalIntegrationMessageInserted,
  customerConnectionChanged,
  callReceived,
  callTalkingReceived,
  callWaitingReceived,
  callAgentReceived,
};
