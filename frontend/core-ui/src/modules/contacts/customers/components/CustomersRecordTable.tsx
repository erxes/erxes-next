import { RecordTable } from 'erxes-ui';

import { customersColumns } from '@/contacts/customers/components/CustomersColumns';
import { contactMoreColumn } from '@/contacts/components/ContactMoreColumn';
import {
  CUSTOMERS_PER_PAGE,
  useCustomers,
} from '@/contacts/customers/hooks/useCustomers';

export const CustomersRecordTable = () => {
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
      columns={customersColumns}
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
        <RecordTable className="min-h-screen">
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
