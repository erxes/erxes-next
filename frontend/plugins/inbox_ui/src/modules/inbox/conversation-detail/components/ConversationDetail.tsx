import { Button, Separator, SideMenu, Skeleton } from 'erxes-ui';
import { ConversationHeader } from '@/inbox/conversation-detail/components/ConversationHeader';
import { useConversationDetail } from '@/inbox/conversation-detail/hooks/useConversationDetail';
import { lazy, Suspense } from 'react';
import { useQueryState } from '../../hooks/useQueryState';
import { activeConversationState } from '../../states/activeConversationState';
import { useAtomValue } from 'jotai';
import { UnderConstruction } from './UnderConstruction';
import { ConversationMessages } from './ConversationMessages';
import { MessagesSkeleton } from './ConversationSkeleton';
import { ConversationDetailLayout } from './ConversationDetailLayout';
import { MessageInput } from './MessageInput';
import { ConversationContext } from '../../context/ConversationContext';
import { IconMessageCircle, IconUser } from '@tabler/icons-react';

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
        <MessagesSkeleton />
      </div>
    );
  }

  if (!['messenger', 'lead'].includes(integration?.kind)) {
    return <UnderConstruction />;
  }
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
            <ConversationMessages />
          </ConversationDetailLayout>
        </ConversationContext.Provider>
      </div>
      <SideMenu className="flex-none">
        <SideMenu.Content value="contact">
          <SideMenu.Header Icon={IconUser} label="Contact" />
          <Separator />
          <div className="flex-auto"></div>
        </SideMenu.Content>
        <SideMenu.Sidebar className="">
          <SideMenu.Trigger Icon={IconUser} label="Contact" value="contact" />
          <Separator.Inline orientation="horizontal" />
        </SideMenu.Sidebar>
      </SideMenu>
    </div>
  );
};
