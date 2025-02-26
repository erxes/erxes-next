import { useMutation } from '@apollo/client';
import { CONVERSATION_ASSIGN } from '../../graphql/mutations/conversationAssign';

export const useAssignConversations = () => {
  const [assignConversations, loading] = useMutation(CONVERSATION_ASSIGN);

  return {
    assignConversations,
    loading,
  };
};
