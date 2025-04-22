import { RecordTable, ScrollArea, useQueryState } from 'erxes-ui';

import { contactColumns } from '@/contacts/components/ContactColumns';
import { contactMoreColumn } from '@/contacts/components/ContactMoreColumn';
import {
  CUSTOMERS_PER_PAGE,
  useCustomers,
} from '@/contacts/hooks/useCustomers';
import { useEffect, useRef, useState } from 'react';

export const ContactsRecordTable = () => {
  const [, setCursor] = useQueryState<string | undefined>('cursor');
  const [cursorItemIds, setCursorItemIds] = useState<string[]>([]);
  const { customers, handleFetchMore, loading, pageInfo } = useCustomers({
    variables: {
      perPage: CUSTOMERS_PER_PAGE,
      page: 1,
      type: 'customer',
    },
  });
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
    pageInfo || {};
  const [isFetchBackward, setIsFetchBackward] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const distanceFromBottomRef = useRef(0);

  // Set default scroll position
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
  }, [customers?.length]);

  return (
    <RecordTable.Provider
      columns={contactColumns}
      data={customers || []}
      stickyColumns={['avatar', 'name']}
      className="mt-1.5"
      moreColumn={contactMoreColumn}
    >
      <ScrollArea.Root className="h-full w-full pb-3 pr-3">
        <ScrollArea.Viewport ref={scrollRef}>
          <RecordTable className="min-h-screen">
            <RecordTable.Header />
            <RecordTable.Body className="rounded-lg overflow-hidden">
              {!loading && hasPreviousPage && (
                <RecordTable.RowSkeleton
                  rows={3}
                  handleInView={() => {
                    setIsFetchBackward(true);
                    handleFetchMore({ direction: 'backward' });
                    if (scrollRef.current) {
                      distanceFromBottomRef.current =
                        scrollRef.current.scrollHeight -
                        scrollRef.current.scrollTop;
                    }
                    setCursorItemIds([...cursorItemIds, startCursor || '']);
                  }}
                />
              )}
              {loading && <RecordTable.RowSkeleton rows={40} />}
              <RecordTable.RowList
                handleRowViewChange={(id, inView) => {
                  if (cursorItemIds.includes(id)) {
                    setCursor(id);
                  } else if (!inView) {
                    sessionStorage.setItem('contacts_cursor', id);
                  }
                }}
              />
              {!loading && hasNextPage && (
                <RecordTable.RowSkeleton
                  rows={1}
                  handleInView={() => {
                    handleFetchMore({ direction: 'forward' });
                    setCursorItemIds([...cursorItemIds, endCursor || '']);
                  }}
                />
              )}
            </RecordTable.Body>
          </RecordTable>
        </ScrollArea.Viewport>
        <ScrollArea.Bar orientation="vertical" />
        <ScrollArea.Bar orientation="horizontal" />
      </ScrollArea.Root>
    </RecordTable.Provider>
  );
};
