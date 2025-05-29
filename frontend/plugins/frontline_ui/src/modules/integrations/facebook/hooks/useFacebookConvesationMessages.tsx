import { useQuery } from '@apollo/client';
import { GET_CONVERSATION_MESSAGES } from '../graphql/queries/fbConversationQueries';
import { useQueryState } from 'erxes-ui';
import { IFacebookConversationMessage } from '../types/FacebookTypes';

export interface IFacebookConversationMessagesQuery {
  facebookConversationMessages: IFacebookConversationMessage[];
}
export interface IFacebookConversationMessagesQueryVariables {
  conversationId: string;
  limit?: number;
  skip?: number;
  getFirst?: boolean;
}

export const FACEBOOK_CONVERSATION_MESSAGES_LIMIT = 20;

export const useFacebookConvesationMessages = () => {
  const [conversationId] = useQueryState<string>('conversationId');

  const { data, loading, error, fetchMore } = useQuery<
    IFacebookConversationMessagesQuery,
    IFacebookConversationMessagesQueryVariables
  >(GET_CONVERSATION_MESSAGES, {
    variables: {
      conversationId: conversationId || '',
      limit: FACEBOOK_CONVERSATION_MESSAGES_LIMIT,
    },
    skip: !conversationId,
  });

  const { facebookConversationMessages } = data || {};

  const handleFetchMore = () => {
    if (
      facebookConversationMessages?.length &&
      facebookConversationMessages?.length %
        FACEBOOK_CONVERSATION_MESSAGES_LIMIT ===
        0
    ) {
      fetchMore({
        variables: {
          skip: data?.facebookConversationMessages?.length || 0,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            facebookConversationMessages: [
              ...fetchMoreResult.facebookConversationMessages,
              ...prev.facebookConversationMessages,
            ],
          };
        },
      });
    }
  };

  return {
    facebookConversationMessages,
    handleFetchMore,
    loading,
    error,
  };
};
