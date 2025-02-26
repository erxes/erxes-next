import { useContext } from 'react';
import { ConversationContext } from '../../context/ConversationContext';

export const useConversationContext = () => {
  return useContext(ConversationContext);
};
