import { createContext } from 'react';
import { IConversation } from '@/inbox/types/Conversation';

export const ConversationContext = createContext<
  IConversation & {
    loading: boolean;
  }
>({} as IConversation & { loading: boolean });
