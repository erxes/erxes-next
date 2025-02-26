import { OperationVariables, useQuery } from '@apollo/client';
import { GET_CONVERSATION_DETAIL } from '~/modules/inbox/conversation-detail/graphql/queries/getConversationDetail';

export const useConversationDetail = (options: OperationVariables) => {
  const { data, loading } = useQuery(GET_CONVERSATION_DETAIL, options);

  return {
    conversationDetail: data?.conversationDetail,
    loading,
  };
};
