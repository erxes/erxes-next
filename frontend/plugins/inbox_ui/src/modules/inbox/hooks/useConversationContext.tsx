import { useContext } from 'react';
import { ConversationContext } from '~/modules/inbox/context/ConversationContext';

export const useConversationContext = () => {
  return useContext(ConversationContext);
};
