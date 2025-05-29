import { useQuery } from '@apollo/client';
import {
  GET_COMMENTS,
  GET_COMMENT_COUNT,
} from '../graphql/queries/fbCommentQueries';

interface UseFbCommentsProps {
  conversationId: string;
  isResolved?: boolean;
  commentId?: string;
  senderId?: string;
  skip?: number;
  limit?: number;
}

export function useFbComments({
  conversationId,
  isResolved,
  commentId,
  senderId,
  skip,
  limit,
}: UseFbCommentsProps) {
  const { data: commentsData, loading: commentsLoading } = useQuery(
    GET_COMMENTS,
    {
      variables: {
        conversationId,
        isResolved,
        commentId,
        senderId,
        skip,
        limit,
      },
      skip: !conversationId,
    },
  );

  const { data: countData, loading: countLoading } = useQuery(
    GET_COMMENT_COUNT,
    {
      variables: {
        conversationId,
        isResolved,
      },
      skip: !conversationId,
    },
  );

  return {
    comments: commentsData?.facebookGetComments || [],
    commentCount: countData?.facebookGetCommentCount || 0,
    loading: commentsLoading || countLoading,
  };
}
