import { useAtomValue } from 'jotai';
import { Separator, Skeleton, useQueryState } from 'erxes-ui';

import { ConversationContext } from '@/inbox/conversations/context/ConversationContext';
import { ConversationHeader } from './ConversationHeader';
import { useConversationDetail } from '../hooks/useConversationDetail';

import { activeConversationState } from '@/inbox/conversations/states/activeConversationState';
import { ConversationDetailLayout } from './ConversationDetailLayout';
import { ConversationIntegrationDetail } from '@/integrations/components/ConversationIntegrationDetail';
import { MessageInput } from './MessageInput';

import { ConversationMessages } from '@/inbox/conversation-messages/components/ConversationMessages';
import { InboxMessagesSkeleton } from '@/inbox/components/InboxMessagesSkeleton';
import { useIntegrationInline } from '@/integrations/hooks/useIntegrations';
import { NoConversationSelected } from './NoConversationSelected';
import { ConversationMarkAsReadEffect } from './ConversationMarkAsReadEffect';

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
    fetchPolicy: 'cache-and-network',
  });

  const { integrationId } = currentConversation || conversationDetail || {};

  const { integration, loading: integrationLoading } = useIntegrationInline({
    variables: {
      _id: integrationId,
    },
    skip: !integrationId,
  });

  if (!conversationDetail && !integration) {
    return <NoConversationSelected />;
  }

  if (loading && !currentConversation && !integrationLoading) {
    return (
      <div className="flex flex-col">
        <div className="h-12 border-b flex-none flex items-center px-6">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-32 h-4 ml-auto" />
        </div>
        <div className="relative h-full">
          <InboxMessagesSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-col h-full overflow-hidden flex-auto">
        <ConversationContext.Provider
          value={{
            ...currentConversation,
            ...conversationDetail,
            integration,
            loading,
          }}
        >
          <ConversationHeader />
          <Separator />
          <ConversationDetailLayout input={<MessageInput />}>
            {integration?.kind &&
              ['messenger', 'lead'].includes(integration?.kind) && (
                <ConversationMessages />
              )}
            <ConversationIntegrationDetail />
          </ConversationDetailLayout>
          <ConversationMarkAsReadEffect />
        </ConversationContext.Provider>
      </div>
    </div>
  );
};
