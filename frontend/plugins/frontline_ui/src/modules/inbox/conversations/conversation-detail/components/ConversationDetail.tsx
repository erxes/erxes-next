import { useAtomValue } from 'jotai';
import { Separator, useQueryState } from 'erxes-ui';

import { ConversationContext } from '@/inbox/conversations/context/ConversationContext';
import { ConversationHeader } from './ConversationHeader';
import { useConversationDetail } from '../hooks/useConversationDetail';

import { activeConversationState } from '@/inbox/conversations/states/activeConversationState';
import { ConversationDetailLayout } from './ConversationDetailLayout';
import { ConversationIntegrationDetail } from './ConversationIntegrationDetail';
import { MessageInput } from './MessageInput';

import { ConversationMessages } from '@/inbox/conversation-messages/components/ConversationMessages';
import { InboxMessagesSkeleton } from '@/inbox/components/InboxMessagesSkeleton';

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

  const { integration } = currentConversation || conversationDetail || {};

  if (loading && !currentConversation) {
    return (
      <div className="relative h-full">
        <InboxMessagesSkeleton />
      </div>
    );
  }

  // if (!['messenger', 'lead'].includes(integration?.kind)) {
  //   return <UnderConstruction />;
  // }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-col h-full overflow-hidden flex-auto">
        <ConversationContext.Provider
          value={{
            ...currentConversation,
            ...conversationDetail,
            loading,
          }}
        >
          <ConversationHeader />
          <Separator />
          <ConversationDetailLayout input={<MessageInput />}>
            {['messenger', 'lead'].includes(integration?.kind) && (
              <ConversationMessages />
            )}
            <ConversationIntegrationDetail />
          </ConversationDetailLayout>
        </ConversationContext.Provider>
      </div>
    </div>
  );
};
