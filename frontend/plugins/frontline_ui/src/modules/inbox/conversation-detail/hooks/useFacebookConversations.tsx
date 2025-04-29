import { OperationVariables, useQuery } from '@apollo/client';
import { GET_FACEBOOK_CONVERSATIONS } from '@/inbox/conversation-detail/graphql/queries/getFacebookConverstions';

export const useFacebookConversations = (options: OperationVariables) => {
  const { data, loading } = useQuery(GET_FACEBOOK_CONVERSATIONS, options);

  return {
    conversations: data?.facebookConversationMessages,
    loading,
  };
};
