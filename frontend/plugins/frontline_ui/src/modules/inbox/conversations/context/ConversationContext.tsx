import { createContext } from 'react';
import { IConversation } from '@/inbox/types/Conversation';
import { IIntegration } from '@/integrations/types/Integration';

export const ConversationContext = createContext<
  Partial<IConversation> & {
    loading?: boolean;
    integration?: IIntegration;
  }
>({} as IConversation & { loading?: boolean; integration?: IIntegration });
