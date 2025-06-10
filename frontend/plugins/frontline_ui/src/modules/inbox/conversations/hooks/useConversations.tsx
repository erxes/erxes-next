import { GET_CONVERSATIONS } from '@/inbox/conversations/graphql/queries/getConversations';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { IConversation } from '../../types/Conversation';
import {
  EnumCursorDirection,
  ICursorListResponse,
  mergeCursorData,
  validateFetchMore,
} from 'erxes-ui';
import { CONVERSATIONS_LIMIT } from '@/inbox/constants/conversationsConstants';

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
    if (!validateFetchMore({ direction, pageInfo })) {
      return;
    }

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: CONVERSATIONS_LIMIT,
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
