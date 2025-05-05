import { RecordTable } from 'erxes-ui';
import { useCustomers } from '@/contacts/customers/hooks/useCustomers';
import { customersColumns } from './CustomersColumns';

export const CustomersRecordTable = () => {
  const { customers, handleFetchMore, loading, pageInfo } = useCustomers();
  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    pageInfo || {};

  return (
    <RecordTable.Provider
      columns={customersColumns}
      data={customers || []}
      stickyColumns={['more', 'checkbox', 'avatar', 'name']}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={customers?.length}
        sessionKey="customers_cursor"
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
              startCursor={startCursor}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
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
