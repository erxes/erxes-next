import { GET_CONVERSATIONS } from '@/inbox/graphql/queries/getConversations';
import { OperationVariables, useQuery } from '@apollo/client';

export const useConversations = (options?: OperationVariables) => {
  const { data, loading, fetchMore } = useQuery(GET_CONVERSATIONS, options);

  const { conversations } = data || {};
  const { list = [], totalCount = 0 } = conversations || {};

  const handleFetchMore = () => {
    if (list?.length >= totalCount) return;
    fetchMore({
      variables: {
        skip: list?.length,
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
    totalCount,
    conversations: list,
    loading,
    handleFetchMore,
  };
};
