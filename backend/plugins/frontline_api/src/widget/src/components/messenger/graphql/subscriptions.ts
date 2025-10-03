import { messageFields } from './fields';

const CLOUDFLARE_CALL_RECEIVED = `
  subscription cloudflareReceivedCall($roomState: String, $audioTrack: String)
  {
    cloudflareReceivedCall(roomState: $roomState, audioTrack: $audioTrack){
      roomState
      audioTrack
    }
  }`;

const conversationChanged = `
  subscription conversationChanged($_id: String!) {
    conversationChanged(_id: $_id) {
      type
    }
  }
`;

const ConversationMessageInserted = `
  subscription ConversationMessageInserted($_id: String!) {
    ConversationMessageInserted(_id: $_id) {
      ${messageFields}
      videoCallData {
        url
        status
      }
    }
  }
`;

const conversationBotTypingStatus = `
  subscription conversationBotTypingStatus($_id: String!) {
    conversationBotTypingStatus(_id: $_id)
  }
`;

const adminMessageInserted = `
  subscription conversationAdminMessageInserted($customerId: String) {
    conversationAdminMessageInserted(customerId: $customerId) {
      unreadCount
    }
  }
`;

export {
  CLOUDFLARE_CALL_RECEIVED,
  ConversationMessageInserted,
  adminMessageInserted,
  conversationChanged,
  conversationBotTypingStatus,
};
