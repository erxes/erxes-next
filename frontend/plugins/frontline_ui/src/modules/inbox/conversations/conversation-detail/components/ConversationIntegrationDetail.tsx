import { lazy, Suspense } from 'react';
import { IntegrationKind } from '@/types/Integration';
import { useConversationContext } from '../hooks/useConversationContext';
import { MessagesSkeleton } from '@/inbox/conversation-messages/components/MessagesSkeleton';

const IMapConversationDetail = lazy(() =>
  import('@/integrations/imap/components/ImapConversationDetail').then(
    (module) => ({ default: module.ImapConversationDetail }),
  ),
);

const FbPostConversationDetail = lazy(() =>
  import('@/integrations/facebook/components/FbPostConversationDetail').then(
    (module) => ({ default: module.FbPostConversationDetail }),
  ),
);

const FbMessengerConversationDetail = lazy(() =>
  import(
    '@/integrations/facebook/components/FbMessengerConversationDetail'
  ).then((module) => ({ default: module.FbMessengerConversationDetail })),
);

export const ConversationIntegrationDetail = () => {
  const { integration } = useConversationContext();

  return (
    <Suspense fallback={<MessagesSkeleton isFetched={false} />}>
      {integration?.kind === IntegrationKind.IMAP && <IMapConversationDetail />}
      {integration?.kind === IntegrationKind.FACEBOOK_POST && (
        <FbPostConversationDetail />
      )}
      {integration?.kind === IntegrationKind.FACEBOOK_MESSENGER && (
        <FbMessengerConversationDetail />
      )}
    </Suspense>
  );
};
