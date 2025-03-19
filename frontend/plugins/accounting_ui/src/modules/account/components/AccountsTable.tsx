import { useAccounts } from '@/account/hooks/useAccounts';
import { RecordTable } from 'erxes-ui/modules';
import { accountsColumns } from '@/account/components/AccountsColumns';
export const AccountsTable = () => {
  const { accounts, loading, error, handleFetchMore, totalCount } = useAccounts(
    {
      variables: {
        perPage: 10,
        page: 1,
        categoryId: null,
      },
    },
  );
  return (
    <RecordTable.Provider
      columns={accountsColumns}
      data={accounts || []}
      handleReachedBottom={handleFetchMore}
      stickyColumns={[]}
      moreColumn={undefined}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > accounts?.length && (
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
