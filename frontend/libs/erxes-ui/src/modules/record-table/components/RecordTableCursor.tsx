/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollArea } from 'erxes-ui/components';
import { RecordTable } from 'erxes-ui/modules';
import { useEffect, useRef, useState } from 'react';
import {
  EnumCursorDirection,
  IRecordTableCursorPageInfo,
} from '../types/RecordTableCursorTypes';
import { RecordTableCursorContext } from '../contexts/RecordTableCursorContext';
import { useRecordTableCursorContext } from '../hooks/useRecordTableCursorContext';

export const RecordTableCursorProvider = ({
  children,
  hasPreviousPage,
  loading,
  dataLength,
  hasNextPage,
  sessionKey,
}: {
  children: React.ReactNode;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  loading?: boolean;
  dataLength?: number;
  sessionKey: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFetchBackward, setIsFetchBackward] = useState(false);
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
      sessionStorage.setItem(sessionKey, firstVisibleRow.id);
    }
  };

  return (
    <RecordTableCursorContext.Provider
      value={{
        scrollRef,
        isFetchBackward,
        setIsFetchBackward,
        distanceFromBottomRef,
        hasNextPage,
        hasPreviousPage,
      }}
    >
      <ScrollArea.Root className="h-full w-full pb-2 pr-2 relative">
        <ScrollArea.Viewport ref={scrollRef} onScroll={handleScroll}>
          <div className="min-h-[calc(100vh-8rem)]">{children}</div>
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
  handleFetchMore: (params: { direction: EnumCursorDirection }) => void;
  startCursor: IRecordTableCursorPageInfo['startCursor'];
}) => {
  const {
    setIsFetchBackward,
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
        handleFetchMore({ direction: EnumCursorDirection.BACKWARD });
        if (scrollRef.current) {
          distanceFromBottomRef.current =
            scrollRef.current.scrollHeight - scrollRef.current.scrollTop;
        }
      }}
    />
  );
};

export const RecordTableForwardSkeleton = ({
  handleFetchMore,
}: {
  handleFetchMore: (params: { direction: EnumCursorDirection }) => void;
  endCursor: IRecordTableCursorPageInfo['endCursor'];
}) => {
  const { hasNextPage, loading } = useRecordTableCursorContext();

  if (!hasNextPage || loading) {
    return null;
  }

  const handleInView = () => {
    handleFetchMore({ direction: EnumCursorDirection.FORWARD });
  };

  return <RecordTable.RowSkeleton rows={1} handleInView={handleInView} />;
};
