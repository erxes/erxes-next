import { useQuery } from '@apollo/client';
import { IMAP_CONVERSATION_DETAIL_QUERY } from '../graphql/queries/imapQueries';
import { useConversationContext } from '@/inbox/conversation-detail/hooks/useConversationContext';

export const ImapConversationDetail = () => {
  const { _id } = useConversationContext();

  const { data } = useQuery(IMAP_CONVERSATION_DETAIL_QUERY, {
    variables: { conversationId: _id },
  });

  console.log(data);

  return <div>IMapConversationDetail</div>;
};
