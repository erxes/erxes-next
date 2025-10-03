import {
  connectionAtom,
  integrationIdAtom,
} from '@/components/messenger/atoms';
import { GET_WIDGETS_CONVERSATIONS } from '@/components/messenger/graphql/queries';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';

interface IQueryResponse {
  widgetsConversations: {
    _id: string;
    content: string;
    createdAt: string;
    participatedUsers: {
      _id: string;
      details: {
        avatar: string;
        fullName: string;
        description: string;
        location: string;
        position: string;
        shortName: string;
      };
    }[];
    messages: {
      _id: string;
      createdAt: Date;
      content: string;
      fromBot: boolean;
      customerId: string;
      isCustomerRead: boolean;
      userId: string;
      user: {
        _id: string;
        isOnline: boolean;
        details: {
          avatar: string;
          fullName: string;
        };
      };
    }[];
    idleTime: number;
  }[];
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

  return {
    conversations: data?.widgetsConversations || [],
    loading,
    error,
  };
};
