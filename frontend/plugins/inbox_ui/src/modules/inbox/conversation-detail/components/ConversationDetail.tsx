import { Separator, Skeleton } from 'erxes-ui';
import { ConversationHeader } from '@/inbox/components/ConversationHeader';
import { useConversationDetail } from '@/inbox/conversation-detail/hooks/useConversationDetail';
import { lazy, Suspense } from 'react';
import { useQueryState } from '../../hooks/useQueryState';
import { activeConversationState } from '../../state/activeConversationState';
import { useAtomValue } from 'jotai';
import { UnderConstruction } from './UnderConstruction';

const Messenger = lazy(() =>
  import('./Messenger').then((mod) => ({
    default: mod.Messenger,
  })),
);

const MailDetail = lazy(() =>
  import('./MailDetail').then((mod) => ({
    default: mod.MailDetail,
  })),
);

const FormDetail = lazy(() =>
  import('./FormDetail').then((mod) => ({
    default: mod.FormDetail,
  })),
);

export const ConversationDetail = () => {
  const [conversationId] = useQueryState<string>('conversationId');
  const activeConversationCandidate = useAtomValue(activeConversationState);
  const currentConversation =
    activeConversationCandidate?._id === conversationId &&
    activeConversationCandidate;

  const { conversationDetail } = useConversationDetail({
    variables: {
      _id: conversationId,
    },
    skip: !conversationId || !!currentConversation,
  });

  const { integration, customer, customerId } =
    currentConversation || conversationDetail || {};

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ConversationHeader customerId={customerId} customer={customer} />
      <Separator />
      <Suspense fallback={<Skeleton className="h-full" />}>
        {(() => {
          switch (integration?.kind) {
            case 'messenger':
              return <Messenger />;
            case 'imap':
              return <MailDetail />;
            case 'lead':
              return <FormDetail />;
            case !!integration?.kind:
              return <UnderConstruction />;
          }
        })()}
      </Suspense>
    </div>
  );
};
