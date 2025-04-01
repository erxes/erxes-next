import { useAccounts } from '@/account/hooks/useAccounts';
import { RecordTable } from 'erxes-ui';
import {
  accountMoreColumn,
  accountsColumns,
} from '@/account/components/AccountsColumns';
import { AccountsCommandbar } from './AccountsCommandBar';

export const AccountsTable = () => {
  const { accounts, loading, handleFetchMore, totalCount } = useAccounts();

  return (
    <RecordTable.Provider
      columns={accountsColumns}
      data={accounts || []}
      handleReachedBottom={handleFetchMore}
      stickyColumns={['name']}
      moreColumn={accountMoreColumn}
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
      <AccountsCommandbar />
    </RecordTable.Provider>
  );
};
