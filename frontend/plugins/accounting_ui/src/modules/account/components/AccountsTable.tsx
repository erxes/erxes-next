import { useAccounts } from '@/account/hooks/useAccounts';
import { RecordTable } from 'erxes-ui';
import { accountsColumns } from '@/account/components/AccountsColumns';
import { AccountsCommandbar } from './AccountsCommandBar';

export const AccountsTable = () => {
  const { accounts, loading, handleFetchMore, totalCount } = useAccounts();

  return (
    <RecordTable.Provider
      columns={accountsColumns}
      data={accounts || []}
      stickyColumns={['name']}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > accounts?.length && (
            <RecordTable.RowSkeleton rows={4} handleInView={handleFetchMore} />
          )}
        </RecordTable.Body>
      </RecordTable>
      <AccountsCommandbar />
    </RecordTable.Provider>
  );
};
