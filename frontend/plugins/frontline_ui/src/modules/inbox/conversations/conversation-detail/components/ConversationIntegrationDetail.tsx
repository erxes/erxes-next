import { lazy, Suspense } from 'react';
import { IntegrationKind } from '@/types/Integration';
import { useConversationContext } from '../hooks/useConversationContext';
import { InboxMessagesSkeleton } from '@/inbox/components/InboxMessagesSkeleton';

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
    '@/integrations/facebook/components/FacebookConversationMessages'
  ).then((module) => ({ default: module.FacebookConversationMessages })),
);

export const ConversationIntegrationDetail = () => {
  const { integration } = useConversationContext();

  return (
    <Suspense fallback={<InboxMessagesSkeleton isFetched={false} />}>
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
