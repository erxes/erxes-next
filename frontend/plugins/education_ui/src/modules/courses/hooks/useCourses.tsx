import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_COURSES } from '@/courses/graphql/queries/getCourse';
import { ICourse } from '@/courses/types/courseType';
import {
  useRecordTableCursor,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  EnumCursorDirection,
  validateFetchMore,
} from 'erxes-ui';

export const COURSES_PER_PAGE = 30;

export const useCourses = (options?: QueryHookOptions) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'contacts_cursor',
  });

  const { data, loading, fetchMore } = useQuery<{
    courses: {
      list: ICourse[];
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(GET_COURSES, {
    ...options,
    variables: {
      limit: COURSES_PER_PAGE,
      cursor,
    },
  });

  const { list: courses, pageInfo } = data?.courses || {};

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
        limit: COURSES_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          courses: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.courses,
            prevResult: prev.courses,
          }),
        });
      },
    });
  };

  return {
    loading,
    courses,
    handleFetchMore,
    pageInfo,
  };
};
