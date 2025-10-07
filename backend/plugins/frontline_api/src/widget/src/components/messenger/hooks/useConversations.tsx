import {
  connectionAtom,
  integrationIdAtom,
} from '@/components/messenger/atoms';
import { GET_WIDGETS_CONVERSATIONS } from '@/components/messenger/graphql/queries';
import { IConversationMessage } from '@/types';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

interface IQueryResponse {
  widgetsConversations: IConversationMessage[];
}

export const useConversations = (
  options?: QueryHookOptions<IQueryResponse>,
) => {
  const integrationId = useAtomValue(integrationIdAtom);
  const connection = useAtomValue(connectionAtom);
  const { customerId, visitorId } = connection.data || {};
  const { data, loading, error } = useQuery<IQueryResponse>(
    GET_WIDGETS_CONVERSATIONS,
    {
      ...options,
      variables: {
        integrationId,
        customerId: customerId || undefined,
        visitorId: visitorId || undefined,
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const lastMessegesByContent = useMemo(() => {
    return data?.widgetsConversations.map((conversation) => {
      return conversation.messages.find(
        (message) => message.content === conversation.content,
      );
    });
  }, [data]);

  return {
    conversations: data?.widgetsConversations || [],
    lastMesseges: lastMessegesByContent,
    loading,
    error,
  };
};
