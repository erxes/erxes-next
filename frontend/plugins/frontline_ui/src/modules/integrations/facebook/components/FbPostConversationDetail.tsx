import { useFbComments } from '../hooks/useFbComments';
import { useFbPosts } from '../hooks/useFbPosts';
import { Card, Skeleton, ScrollArea, Avatar } from 'erxes-ui';
import { format } from 'date-fns';
import { useConversationContext } from '@/inbox/hooks/useConversationContext';

interface FbPostConversationDetailProps {
  conversationId: string;
  erxesApiId?: string;
}

export function FbPostConversationDetail() {
  const { _id } = useConversationContext();

  const {
    comments,
    commentCount,
    loading: commentsLoading,
  } = useFbComments({
    conversationId: _id,
    limit: 20,
  });

  // const { post, loading: postLoading } = useFbPosts({ erxesApiId });

  return (
    <div>
      <p>{_id}</p>
    </div>
  );
}
