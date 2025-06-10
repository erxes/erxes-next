import { QueryHookOptions, useQuery } from '@apollo/client';
import {
  useRecordTableCursor,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  EnumCursorDirection,
  validateFetchMore,
} from 'erxes-ui';
import { ITeacher } from '@/teachers/types/teacherType';
import { GET_TEACHERS } from '~/modules/teachers/graphql/queries/getTeachers';

export const useTeachers = (options?: QueryHookOptions) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'teacher_cursor',
  });

  const { data, loading, fetchMore, error } = useQuery<{
    teachers: {
      list: ITeacher[];
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(GET_TEACHERS, {
    ...options,
    variables: {
      cursor,
    },
  });

  const { list: teachers, pageInfo } = data?.teachers || {};

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
          teachers: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.teachers,
            prevResult: prev.teachers,
          }),
        });
      },
    });
  };

  return {
    loading,
    teachers,
    handleFetchMore,
    pageInfo,
    error,
  };
};
