import { createContext } from 'react';
import { IConversation } from '@/inbox/types/Conversation';

export const ConversationContext = createContext<IConversation>(
  {} as IConversation,
);
