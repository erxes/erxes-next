import { OperationVariables } from '@apollo/client';

import { useQuery } from '@apollo/client';
import { GET_CONVERSATION_MESSAGES } from '../graphql/queries/getConversationMessages';
import { useEffect } from 'react';
import { CONVERSATION_MESSAGE_INSERTED } from '../../graphql/subscriptions/inboxSubscriptions';

export const useConversationMessages = (options: OperationVariables) => {
  const { data, loading, fetchMore, subscribeToMore } = useQuery(
    GET_CONVERSATION_MESSAGES,
    options,
  );

  const { conversationMessages, conversationMessagesTotalCount } = data || {};

  const handleFetchMore = (onCompleted?: () => void) => {
    if (
      !loading ||
      conversationMessagesTotalCount > conversationMessages.length
    ) {
      fetchMore({
        variables: {
          skip: conversationMessages.length,
          limit: 5,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          setTimeout(() => {
            onCompleted?.();
          }, 10);
          return {
            conversationMessages: [
              ...fetchMoreResult.conversationMessages,
              ...prev.conversationMessages,
            ],
          };
        },
      });
    }
  };

  useEffect(() => {
    console.log('subscribeToMore');
    subscribeToMore({
      document: CONVERSATION_MESSAGE_INSERTED,
      variables: {
        _id: options.variables?.conversationId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        return {
          conversationMessages: [
            ...prev.conversationMessages,
            subscriptionData.data.conversationMessageInserted,
          ],
        };
      },
    });
  }, []);

  return {
    messages: conversationMessages,
    totalCount: conversationMessagesTotalCount,
    loading,
    handleFetchMore,
  };
};
