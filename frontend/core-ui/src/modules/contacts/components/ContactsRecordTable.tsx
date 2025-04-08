import { RecordTable } from 'erxes-ui/modules/record-table';

import { contactColumns } from '@/contacts/components/ContactColumns';
import { contactMoreColumn } from '@/contacts/components/ContactMoreColumn';
import {
  CUSTOMERS_PER_PAGE,
  useCustomers,
} from '@/contacts/hooks/useCustomers';

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
      columns={contactColumns}
      data={customers || []}
      handleReachedBottom={handleFetchMore}
      stickyColumns={['avatar', 'name']}
      className="mt-1.5"
      moreColumn={contactMoreColumn}
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
