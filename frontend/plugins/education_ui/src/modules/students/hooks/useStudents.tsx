import { QueryHookOptions, useQuery } from '@apollo/client';
import { IStudent } from '@/students/types/type';
import {
  useRecordTableCursor,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  EnumCursorDirection,
  validateFetchMore,
} from 'erxes-ui';
import { GET_STUDENTS } from '@/students/graphql/queries/getStudents';

export const STUDENTS_PER_PAGE = 30;

export const useStudents = (options?: QueryHookOptions) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'student_cursor',
  });

  const { data, loading, error, fetchMore } = useQuery<{
    students: {
      list: IStudent[];
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(GET_STUDENTS, {
    ...options,
    variables: {
      perPage: STUDENTS_PER_PAGE,
      cursor,
    },
  });

  const { list: students, pageInfo } = data?.students || {};

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
        limit: STUDENTS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          students: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.students,
            prevResult: prev.students,
          }),
        });
      },
    });
  };

  return {
    loading,
    students,
    handleFetchMore,
    pageInfo,
    error,
  };
};
