import { QueryHookOptions, useQuery } from '@apollo/client';
import {
  useRecordTableCursor,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  EnumCursorDirection,
  validateFetchMore,
} from 'erxes-ui';
import { ICourseComment } from '@/courses/types/commentsType';
import { GET_COMMENTS } from '@/courses/graphql/queries/getComments';

export const useCourseComments = (
  courseId: string | null,
  options?: QueryHookOptions,
) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'course_comments_cursor',
  });

  const { data, loading, fetchMore } = useQuery<{
    courseComments: {
      list: ICourseComment[];
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(GET_COMMENTS, {
    ...options,
    variables: {
      cursor,
      courseId,
    },
    skip: !courseId,
  });

  const { list: courseComments, pageInfo } = data?.courseComments || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) return;
    return fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          courseComments: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.courseComments,
            prevResult: prev.courseComments,
          }),
        });
      },
    });
  };

  return {
    loading,
    courseComments,
    handleFetchMore,
    pageInfo,
  };
};
