import { MessengerMessages } from './MessengerMessages';
import { MessageInput } from './MessageInput';
import { ConversationDetailLayout } from './ConversationDetailLayout';

export const Messenger = () => {
  return (
    <ConversationDetailLayout input={<MessageInput />}>
      <MessengerMessages />
    </ConversationDetailLayout>
  );
};
