import { RecordTable } from 'erxes-ui';
import { useCustomers } from '@/contacts/customers/hooks/useCustomers';
import { customersColumns } from './CustomersColumns';
import { CustomersCommandBar } from '@/contacts/customers/components/customers-command-bar';
import { CUSTOMERS_CURSOR_SESSION_KEY } from '@/contacts/customers/constants/customersCursorSessionKey';

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
        sessionKey={CUSTOMERS_CURSOR_SESSION_KEY}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
      <CustomersCommandBar />
    </RecordTable.Provider>
  );
};
