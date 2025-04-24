import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_COURSES } from '@/courses/graphql/queries/getCourse';
import { ICourse } from '@/courses/types/courseType';
import {
  useRecordTableCursor,
  IRecordTableCursorPageInfo,
  getCursorPageInfo,
} from 'erxes-ui';

export const COURSES_PER_PAGE = 30;

export const useCourses = (options?: QueryHookOptions) => {
  const { cursor, setCursor } = useRecordTableCursor({
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
    direction: 'forward' | 'backward';
    onFetchMoreCompleted?: (fetchMoreResult: {
      customers: {
        list: ICourse[];
      };
    }) => void;
  }) => {
    if (
      (direction === 'forward' && pageInfo?.hasNextPage) ||
      (direction === 'backward' && pageInfo?.hasPreviousPage)
    ) {
      return fetchMore({
        variables: {
          cursor:
            direction === 'forward'
              ? pageInfo?.endCursor
              : pageInfo?.startCursor,
          limit: COURSES_PER_PAGE,
          direction,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const { pageInfo: fetchMorePageInfo, list: fetchMoreList = [] } =
            fetchMoreResult.courses;

          const { pageInfo: prevPageInfo, list: prevList = [] } =
            prev.courses || {};

          setCursor(prevPageInfo?.endCursor);

          return Object.assign({}, prev, {
            customers: {
              pageInfo: getCursorPageInfo({
                direction,
                fetchMorePageInfo,
                prevPageInfo,
              }),
              list:
                direction === 'forward'
                  ? [...prevList, ...fetchMoreList]
                  : [...fetchMoreList, ...prevList],
            },
          });
        },
      });
    }
  };

  return {
    loading,
    courses,
    handleFetchMore,
    pageInfo,
  };
};
