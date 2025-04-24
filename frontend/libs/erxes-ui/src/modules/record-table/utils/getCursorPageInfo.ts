import { IRecordTableCursorPageInfo } from '../types/RecordTableCursorTypes';

export const getCursorPageInfo = ({
  direction,
  fetchMorePageInfo,
  prevPageInfo,
}: {
  direction: 'forward' | 'backward';
  fetchMorePageInfo: IRecordTableCursorPageInfo;
  prevPageInfo: IRecordTableCursorPageInfo;
}) => {
  const { endCursor, hasNextPage, hasPreviousPage, startCursor } =
    fetchMorePageInfo;
  const {
    endCursor: prevEndCursor,
    hasNextPage: prevHasNextPage,
    hasPreviousPage: prevHasPreviousPage,
    startCursor: prevStartCursor,
  } = prevPageInfo;

  return {
    endCursor: direction === 'forward' ? endCursor : prevEndCursor,
    hasNextPage: direction === 'forward' ? hasNextPage : prevHasNextPage,
    hasPreviousPage:
      direction === 'forward' ? prevHasPreviousPage : hasPreviousPage,
    startCursor: direction === 'forward' ? prevStartCursor : startCursor,
  };
};
