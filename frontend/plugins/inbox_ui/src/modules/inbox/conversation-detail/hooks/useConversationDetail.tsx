import { OperationVariables, useQuery } from '@apollo/client';
import { GET_CONVERSATION_DETAIL } from '~/modules/inbox/conversation-detail/graphql/queries/getConversationDetail';

export const useConversationDetail = (options: OperationVariables) => {
  const { data, loading } = useQuery(GET_CONVERSATION_DETAIL, options);

  // useEffect(() => {
  //   const unsubscribe = subscribeToMore({
  //     document: CONVERSATION_CHANGED,
  //     variables: {
  //       _id: options.variables?._id,
  //     },
  //     updateQuery: (prev, { subscriptionData }) => {
  //       if (!subscriptionData.data) return prev;

  //       const newConversation = subscriptionData.data.conversationChanged;

  //       return {
  //         conversationDetail: newConversation,
  //       };
  //     },
  //   });

  //   return unsubscribe;
  // }, [options.variables?._id]);
  return {
    conversationDetail: data?.conversationDetail,
    loading,
  };
};
