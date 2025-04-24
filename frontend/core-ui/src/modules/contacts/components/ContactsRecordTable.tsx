import { RecordTable } from 'erxes-ui';

import { contactColumns } from '@/contacts/components/ContactColumns';
import { contactMoreColumn } from '@/contacts/components/ContactMoreColumn';
import {
  CUSTOMERS_PER_PAGE,
  useCustomers,
} from '@/contacts/hooks/useCustomers';

export const ContactsRecordTable = () => {
  const { customers, handleFetchMore, loading, pageInfo } = useCustomers({
    variables: {
      perPage: CUSTOMERS_PER_PAGE,
      page: 1,
      type: 'customer',
    },
  });
  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    pageInfo || {};

  return (
    <RecordTable.Provider
      columns={contactColumns}
      data={customers || []}
      stickyColumns={['avatar', 'name']}
      className="mt-1.5"
      moreColumn={contactMoreColumn}
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={customers?.length}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body className="rounded-lg overflow-hidden">
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
              startCursor={startCursor}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.CursorRowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
              endCursor={endCursor}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
    </RecordTable.Provider>
  );
};
