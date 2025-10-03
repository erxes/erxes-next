import { IConversation } from '@/types';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_CONVERSATION_DETAIL } from '../graphql/queries';

interface IQueryResponse {
  widgetsConversationDetail: IConversation;
}

export const useConversationDetail = (
  options?: QueryHookOptions<IQueryResponse>,
) => {
  const { data, loading, refetch } = useQuery<IQueryResponse>(
    GET_CONVERSATION_DETAIL,
    {
      ...options,
      fetchPolicy: 'cache-and-network',
    },
  );

  const handleRefetch = (args?: QueryHookOptions<IQueryResponse>) => {
    return refetch(args?.variables);
  };

  return {
    conversationDetail: data?.widgetsConversationDetail,
    loading,
    handleRefetch,
  };
};
