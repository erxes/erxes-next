import { QueryHookOptions, useQuery } from '@apollo/client';
import { IClass } from '@/classes/types/type';
import {
  useRecordTableCursor,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  EnumCursorDirection,
  validateFetchMore,
} from 'erxes-ui';
import { GET_CLASSES } from '@/classes/graphql/queries/getClasses';

export const CLASSES_PER_PAGE = 30;

export const useClasses = (options?: QueryHookOptions) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'class_cursor',
  });

  const { data, loading, fetchMore } = useQuery<{
    courseClasses: {
      list: IClass[];
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(GET_CLASSES, {
    ...options,
    variables: {
      perPage: CLASSES_PER_PAGE,
      cursor,
    },
  });

  const { list: classes, pageInfo } = data?.courseClasses || {};

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
        limit: CLASSES_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          classCourse: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.courseClasses,
            prevResult: prev.courseClasses,
          }),
        });
      },
    });
  };

  return {
    loading,
    classes,
    handleFetchMore,
    pageInfo,
  };
};
