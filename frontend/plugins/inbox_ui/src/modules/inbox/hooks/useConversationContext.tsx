import { useContext } from 'react';
import { ConversationContext } from '@/inbox/context/ConversationConxtext';

export const useConversationContext = () => {
  return useContext(ConversationContext);
};
