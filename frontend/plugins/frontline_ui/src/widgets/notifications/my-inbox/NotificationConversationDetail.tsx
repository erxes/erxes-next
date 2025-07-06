import { ConversationDetail } from '@/inbox/conversations/conversation-detail/components/ConversationDetail';
import { IconExternalLink } from '@tabler/icons-react';
import { Button, useQueryState } from 'erxes-ui';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { PageHeader, PageHeaderEnd } from 'ui-modules';

export const NotificationConversationDetail = ({ contentTypeId }: any) => {
  const [conversationId, setConversationId] =
    useQueryState<string>('conversationId');

  useEffect(() => {
    if (conversationId !== contentTypeId) {
      setConversationId(contentTypeId);
    }
  }, [contentTypeId, conversationId]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeaderEnd>
          <Button variant="outline" asChild>
            <Link to={`/inbox?conversationId=${contentTypeId}`}>
              Go to Conversation
              <IconExternalLink />
            </Link>
          </Button>
        </PageHeaderEnd>
      </PageHeader>
      <ConversationDetail />
    </div>
  );
};
