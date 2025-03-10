import { createContext } from 'react';
import { IMessage } from '../types/Conversation';

export const ConversationMessageContext = createContext<
  IMessage & { previousMessage: IMessage; nextMessage: IMessage }
>({} as IMessage & { previousMessage: IMessage; nextMessage: IMessage });
