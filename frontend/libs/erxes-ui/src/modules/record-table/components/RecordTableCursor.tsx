/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollArea } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { RecordTable } from 'erxes-ui/modules';
import { useEffect, useRef, useState } from 'react';
import { IRecordTableCursorPageInfo } from '../types/RecordTableCursorTypes';
import { RecordTableCursorContext } from '../contexts/RecordTableCursorContext';
import { useRecordTableCursorContext } from '../hooks/useRecordTableCursorContext';

export const RecordTableCursorProvider = ({
  children,
  hasPreviousPage,
  loading,
  dataLength,
  hasNextPage,
}: {
  children: React.ReactNode;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  loading?: boolean;
  dataLength?: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFetchBackward, setIsFetchBackward] = useState(false);
  const [cursorItemIds, setCursorItemIds] = useState<string[]>([]);
  const distanceFromBottomRef = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 102;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      if (!hasPreviousPage && !loading) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [hasPreviousPage]);

  useEffect(() => {
    if (scrollRef.current) {
      if (distanceFromBottomRef.current && isFetchBackward) {
        scrollRef.current.scrollTop =
          scrollRef.current.scrollHeight - distanceFromBottomRef.current;
        distanceFromBottomRef.current = 0;
        setIsFetchBackward(false);
      }
    }
  }, [dataLength]);

  const handleScroll = () => {
    const firstVisibleRow = scrollRef.current?.querySelector('.in-view');
    if (firstVisibleRow) {
      sessionStorage.setItem('contacts_cursor', firstVisibleRow.id);
    }
  };

  return (
    <RecordTableCursorContext.Provider
      value={{
        scrollRef,
        isFetchBackward,
        cursorItemIds,
        setCursorItemIds,
        setIsFetchBackward,
        distanceFromBottomRef,
        hasNextPage,
        hasPreviousPage,
      }}
    >
      <ScrollArea.Root className="h-full w-full pb-3 pr-3">
        <ScrollArea.Viewport ref={scrollRef} onScroll={handleScroll}>
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Bar orientation="vertical" />
        <ScrollArea.Bar orientation="horizontal" />
      </ScrollArea.Root>
    </RecordTableCursorContext.Provider>
  );
};

export const RecordTableBackwardSkeleton = ({
  handleFetchMore,
  startCursor,
}: {
  handleFetchMore: (params: { direction: 'backward' | 'forward' }) => void;
  startCursor: IRecordTableCursorPageInfo['startCursor'];
}) => {
  const {
    setIsFetchBackward,
    cursorItemIds,
    setCursorItemIds,
    scrollRef,
    distanceFromBottomRef,
    hasPreviousPage,
    loading,
  } = useRecordTableCursorContext();

  if (!hasPreviousPage || loading) {
    return null;
  }

  return (
    <RecordTable.RowSkeleton
      rows={3}
      backward
      handleInView={() => {
        setIsFetchBackward(true);
        handleFetchMore({ direction: 'backward' });
        if (scrollRef.current) {
          distanceFromBottomRef.current =
            scrollRef.current.scrollHeight - scrollRef.current.scrollTop;
        }
        setCursorItemIds([...cursorItemIds, startCursor || '']);
      }}
    />
  );
};

export const RecordTableForwardSkeleton = ({
  handleFetchMore,
  endCursor,
}: {
  handleFetchMore: (params: { direction: 'backward' | 'forward' }) => void;
  endCursor: IRecordTableCursorPageInfo['endCursor'];
}) => {
  const { cursorItemIds, setCursorItemIds, hasNextPage, loading } =
    useRecordTableCursorContext();

  if (!hasNextPage || loading) {
    return null;
  }

  const handleInView = () => {
    handleFetchMore({ direction: 'forward' });
    setCursorItemIds([...cursorItemIds, endCursor || '']);
  };

  return <RecordTable.RowSkeleton rows={1} handleInView={handleInView} />;
};

export const RecordTableCursorRowList = () => {
  const [, setCursor] = useQueryState<string | undefined>('cursor');
  const { cursorItemIds } = useRecordTableCursorContext();

  return (
    <RecordTable.RowList
      handleRowViewChange={(id, inView) => {
        if (cursorItemIds.includes(id) && inView) {
          setCursor(id);
        }
      }}
    />
  );
};
