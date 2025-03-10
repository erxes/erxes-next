import { OperationVariables, useQuery } from '@apollo/client';
import { getImapConversationDetail } from '../graphql/queries/getImapConversationDetail';

export const useImapConversationDetail = (options: OperationVariables) => {
  const { data, loading } = useQuery(getImapConversationDetail, options);

  return {
    conversationDetail: data?.imapConversationDetail,
    loading,
  };
};
