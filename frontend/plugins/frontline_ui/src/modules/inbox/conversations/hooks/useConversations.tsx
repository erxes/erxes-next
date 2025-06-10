import { GET_CONVERSATIONS } from '~/modules/inbox/conversations/graphql/queries/getConversations';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { IConversation } from '../../types/Conversation';
import {
  EnumCursorDirection,
  ICursorListResponse,
  mergeCursorData,
} from 'erxes-ui';

export const useConversations = (
  options?: QueryHookOptions<ICursorListResponse<IConversation>>,
) => {
  const { data, loading, fetchMore } = useQuery<
    ICursorListResponse<IConversation>
  >(GET_CONVERSATIONS, options);

  const { conversations } = data || {};
  const { list = [], totalCount = 0, pageInfo } = conversations || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!pageInfo?.hasNextPage) return;
    fetchMore({
      variables: {
        cursor: pageInfo?.endCursor,
        limit: 50,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          conversations: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.conversations,
            prevResult: prev.conversations,
          }),
        });
      },
    });
  };

  return {
    totalCount,
    conversations: list,
    loading,
    handleFetchMore,
    pageInfo,
  };
};
