import { MutationHookOptions, useMutation } from '@apollo/client';
import { WIDGETS_INSERT_MESSAGE_MUTATION } from '@/components/messenger/graphql/mutations';
import { useAtom, useAtomValue } from 'jotai';
import {
  connectionAtom,
  conversationIdAtom,
  integrationIdAtom,
} from '@/components/messenger/atoms';
import { getLocalStorageItem } from '@/lib/utils';

export const useInsertMessage = () => {
  const integrationId = useAtomValue(integrationIdAtom);
  const [connection] = useAtom(connectionAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const { data } = connection;
  const { visitorId } = data;
  const [insertMessage, { loading }] = useMutation(
    WIDGETS_INSERT_MESSAGE_MUTATION,
  );
  const customerId = conversationId ? getLocalStorageItem('customerId') : undefined;
  const handleInsertMessage = (options?: MutationHookOptions) => {
    return insertMessage({
      ...options,
      variables: {
        integrationId,
        visitorId: visitorId || undefined,
        conversationId: conversationId || undefined,
        customerId: customerId,
        ...options?.variables,
      },
      refetchQueries: ['widgetsConversations', 'widgetsConversationDetail'],
    });
  };
  return {
    insertMessage: handleInsertMessage,
    loading,
  };
};
