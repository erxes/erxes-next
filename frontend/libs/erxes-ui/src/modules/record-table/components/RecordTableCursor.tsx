import { ScrollArea } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { RecordTable } from 'erxes-ui/modules';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

export const RecordTableCursorProvider = ({
  children,
  hasPreviousPage,
  loading,
  dataLength,
  hasNextPage,
}: {
  children: React.ReactNode;
  hasPreviousPage?: boolean;
  loading?: boolean;
  dataLength?: number;
  hasNextPage?: boolean;
}) => {
  const distanceFromBottomRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFetchBackward, setIsFetchBackward] = useState(false);
  const [cursorItemIds, setCursorItemIds] = useState<string[]>([]);
  console.log('cursorItemIds', cursorItemIds, distanceFromBottomRef.current);

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
  }, [hasPreviousPage, loading]);

  useEffect(() => {
    if (scrollRef.current) {
      if (distanceFromBottomRef.current && isFetchBackward) {
        console.log(
          'distanceFromBottomRef.current',
          distanceFromBottomRef.current,
        );
        scrollRef.current.scrollTop =
          scrollRef.current.scrollHeight - distanceFromBottomRef.current;
        distanceFromBottomRef.current = 0;
        setIsFetchBackward(false);
      }
    }
  }, [dataLength, isFetchBackward]);

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
        <ScrollArea.Viewport ref={scrollRef}>{children}</ScrollArea.Viewport>
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
  } = useContext(RecordTableCursorContext);

  if (!hasPreviousPage || loading) {
    return null;
  }

  return (
    <RecordTable.RowSkeleton
      rows={3}
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
  const { cursorItemIds, setCursorItemIds, hasNextPage, loading } = useContext(
    RecordTableCursorContext,
  );

  if (!hasNextPage || loading) {
    return null;
  }

  return (
    <RecordTable.RowSkeleton
      rows={1}
      handleInView={() => {
        handleFetchMore({ direction: 'forward' });
        setCursorItemIds([...cursorItemIds, endCursor || '']);
      }}
    />
  );
};

export const RecordTableCursorContext = createContext<{
  scrollRef: React.RefObject<HTMLDivElement>;
  isFetchBackward: boolean;
  cursorItemIds: string[];
  setCursorItemIds: (ids: string[]) => void;
  setIsFetchBackward: (isFetchBackward: boolean) => void;
  distanceFromBottomRef: React.MutableRefObject<number>;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  loading?: boolean;
}>({} as any);

export const RecordTableCursorRowList = () => {
  const [, setCursor] = useQueryState<string | undefined>('cursor');
  const { cursorItemIds } = useContext(RecordTableCursorContext);

  return (
    <RecordTable.RowList
      handleRowViewChange={(id, inView) => {
        if (cursorItemIds.includes(id)) {
          setCursor(id);
        } else if (!inView) {
          sessionStorage.setItem('contacts_cursor', id);
        }
      }}
    />
  );
};

export const useRecordTableCursor = ({
  sessionKey = 'contacts_cursor',
}: {
  sessionKey?: string;
}) => {
  const [cursor, setCursor] = useQueryState<string | undefined>('cursor');
  const [defaultCursor] = useState<string | undefined>(cursor || undefined);
  const [sessionCursor] = useState<string | undefined>(
    sessionStorage.getItem(sessionKey) || undefined,
  );

  return {
    cursor: defaultCursor ? sessionCursor || defaultCursor : undefined,
    setCursor,
    defaultCursor,
    sessionCursor,
  };
};

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
    startCursor: direction === 'forward' ? startCursor : prevStartCursor,
  };
};

export interface IRecordTableCursorPageInfo {
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
}
