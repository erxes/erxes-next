import { Separator, Skeleton } from 'erxes-ui';
import { ConversationHeader } from '@/inbox/components/ConversationHeader';
import { useConversationDetail } from '@/inbox/conversation-detail/hooks/useConversationDetail';
import { lazy, Suspense } from 'react';
import { useQueryState } from '../../hooks/useQueryState';
import { activeConversationState } from '../../state/activeConversationState';
import { useAtomValue } from 'jotai';
import { UnderConstruction } from './UnderConstruction';
import { ConversationMessages } from './ConversationMessages';
import { MessagesSkeleton } from './ConversationSkeleton';
import { ConversationDetailLayout } from './ConversationDetailLayout';
import { MessageInput } from './MessageInput';

export const ConversationDetail = () => {
  const [conversationId] = useQueryState<string>('conversationId');
  const activeConversationCandidate = useAtomValue(activeConversationState);
  const currentConversation =
    activeConversationCandidate?._id === conversationId &&
    activeConversationCandidate;

  const { conversationDetail, loading } = useConversationDetail({
    variables: {
      _id: conversationId,
    },
    skip: !conversationId,
  });

  const { integration, customer, customerId } =
    currentConversation || conversationDetail || {};

  if (loading && !currentConversation) {
    return (
      <div className="relative h-full">
        <MessagesSkeleton />
      </div>
    );
  }

  if (!['messenger', 'lead'].includes(integration?.kind)) {
    return <UnderConstruction />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ConversationHeader customerId={customerId} customer={customer} />
      <Separator />
      <ConversationDetailLayout input={<MessageInput />}>
        <ConversationMessages />
      </ConversationDetailLayout>
    </div>
  );
};
