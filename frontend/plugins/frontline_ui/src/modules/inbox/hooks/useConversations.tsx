import { GET_CONVERSATIONS } from '@/inbox/graphql/queries/getConversations';
import { OperationVariables, useQuery } from '@apollo/client';

export const useConversations = (options?: OperationVariables) => {
  const { data, loading, fetchMore } = useQuery(GET_CONVERSATIONS, options);

  const { conversations, conversationsTotalCount } = data || {};

  const handleFetchMore = () => {
    if (conversations?.length >= conversationsTotalCount) return;
    fetchMore({
      variables: {
        skip: conversations?.length,
        limit: 50,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          conversations: [
            ...prev.conversations,
            ...fetchMoreResult.conversations,
          ],
        };
      },
    });
  };

  return {
    totalCount: conversationsTotalCount,
    conversations,
    loading,
    handleFetchMore,
  };
};
