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
import { useEffect } from 'react';
import { CONVERSATION_CLIENT_MESSAGE_INSERTED } from '../graphql/subscriptions/inboxSubscriptions';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';

export const useConversations = (
  options?: QueryHookOptions<ICursorListResponse<IConversation>>,
) => {
  const { data, fetchMore, subscribeToMore, loading } = useQuery<
    ICursorListResponse<IConversation>
  >(GET_CONVERSATIONS, options);
  const { _id: userId } = useAtomValue(currentUserState) || {};

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

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: CONVERSATION_CLIENT_MESSAGE_INSERTED,
      variables: {
        userId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('subscriptionData', subscriptionData);
        return prev;
      },
      onError: (error) => {
        console.log('error', error);
      },
    });

    return unsubscribe;
  }, []);

  return {
    totalCount,
    conversations: list,
    loading,
    handleFetchMore,
    pageInfo,
  };
};
