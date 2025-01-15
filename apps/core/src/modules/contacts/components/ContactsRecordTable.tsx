import { RecordTable } from 'erxes-ui/modules/record-table';
import {
  CUSTOMERS_PER_PAGE,
  useCustomers,
} from '@/contacts/hooks/useCustomers';
import { columns } from './columns';

export const ContactsRecordTable = () => {
  const { customers, handleFetchMore, loading, totalCount } = useCustomers({
    variables: {
      perPage: CUSTOMERS_PER_PAGE,
      page: 1,
      type: 'customer',
    },
  });

  return (
    <RecordTable.Provider
      columns={columns}
      data={customers || []}
      handleReachedBottom={handleFetchMore}
      stickyColumns={['avatar', 'firstName']}
      className="mt-1.5"
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > customers?.length && (
            <RecordTable.RowSkeleton
              rows={4}
              handleReachedBottom={handleFetchMore}
            />
          )}
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};
