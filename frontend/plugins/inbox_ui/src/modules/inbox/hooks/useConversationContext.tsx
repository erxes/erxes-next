import { useContext } from 'react';
import { ConversationContext } from '@/inbox/context/ConversationContext';

export const useConversationContext = () => {
  return useContext(ConversationContext);
};
