import { InboxMessagesContainer } from '@/inbox/components/InboxMessagesContainer';
import { IFacebookConversationMessage } from '../types/FacebookTypes';
import { Button, RelativeDateDisplay } from 'erxes-ui';
import { useFacebookConversationMessages } from '../hooks/useFacebookConversationMessages';

export const FacebookConversationMessages = () => {
  const { facebookConversationMessages, handleFetchMore } =
    useFacebookConversationMessages();

  return (
    <InboxMessagesContainer
      fetchMore={handleFetchMore}
      messagesLength={facebookConversationMessages?.length || 0}
      totalCount={facebookConversationMessages?.length || 0}
      loading={false}
    >
      {facebookConversationMessages?.map((message) => (
        <FacebookMessageItem key={message._id} message={message} />
      ))}
    </InboxMessagesContainer>
  );
};

export const FacebookMessageItem = ({
  message,
}: {
  message: IFacebookConversationMessage;
}) => {
  return (
    <div>
      <Button asChild className="max-w-content " variant="secondary">
        <div className="text-left">
          {message.content}
          <RelativeDateDisplay.Value value={message.createdAt} />
        </div>
      </Button>
    </div>
  );
};
