import { RecordTable } from 'erxes-ui';
import { useCustomers } from '@/contacts/customers-new/hooks/useCustomers';
import { CUSTOMERS_PER_PAGE } from '@/contacts/customers-new/constants/customersPerPage';
import { customersColumns } from './CustomersColumns';

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
      stickyColumns={['more', 'checkbox', 'avatar', 'name']}
      className="mt-1.5"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={customers?.length}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
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
