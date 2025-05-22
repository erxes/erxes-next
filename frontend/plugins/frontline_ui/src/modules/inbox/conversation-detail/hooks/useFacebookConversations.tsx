import { useQuery } from '@apollo/client';
import { GET_FACEBOOK_CONVERSATIONS } from '../graphql/queries/getFacebookConverstions';

interface FacebookMessage {
  _id: string;
  content: string;
  createdAt: string;
  attachments?: {
    url: string;
  }[];
}

interface FacebookConversationsData {
  facebookConversationMessages: FacebookMessage[];
}

interface FacebookConversationsVars {
  conversationId: string;
  limit?: number;
  skip?: number;
  getFirst?: boolean;
}

export function useFacebookConversations({
  conversationId,
  limit = 20,
  skip = 0,
  getFirst = false,
}: FacebookConversationsVars) {
  const { data, loading, error } = useQuery<
    FacebookConversationsData,
    FacebookConversationsVars
  >(GET_FACEBOOK_CONVERSATIONS, {
    variables: {
      conversationId,
      limit,
      skip,
      getFirst,
    },
    skip: !conversationId,
  });

  return {
    messages: data?.facebookConversationMessages ?? [],
    loading,
    error,
  };
}
