import { OperationVariables, useMutation } from '@apollo/client';
import { CONVERSATION_ASSIGN } from '../../graphql/mutations/conversationAssign';

export const useAssignConversations = (options?: OperationVariables) => {
  const [assignConversations, { loading }] = useMutation(
    CONVERSATION_ASSIGN,
    options,
  );

  const handleAssignConversations = (options: OperationVariables) => {
    assignConversations({
      ...options,
      update: (cache) => {
        try {
          options.variables?.conversationIds.forEach((id: string) => {
            cache.modify({
              id: cache.identify({ __typename: 'Conversation', _id: id }),
              fields: {
                assignedUserId: () => options.variables?.assignedUserId,
              },
            });
          });
        } catch (error) {
          console.error(error);
          return;
        }
      },
    });
  };

  return {
    assignConversations: handleAssignConversations,
    loading,
  };
};
