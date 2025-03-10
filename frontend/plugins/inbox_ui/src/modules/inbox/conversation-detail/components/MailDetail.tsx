import { useQueryState } from '../../hooks/useQueryState';
import { useImapConversationDetail } from '../hooks/useImapConversationDetail';

export const MailDetail = () => {
  const [conversationId] = useQueryState<string>('conversationId');
  const { conversationDetail } = useImapConversationDetail({
    variables: { conversationId },
  });

  return <div>MailDetail</div>;
};
