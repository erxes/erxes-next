import { useTransactions } from '../hooks/useTransactions';
import {
  transactionColumns,
  transactionMoreColumn,
} from './TransactionsTableColumns';
import { RecordTable } from 'erxes-ui';

export const PtrRecordTable = () => {
  const { transactions, loading, totalCount, handleFetchMore } =
    useTransactions();

  return (
    <RecordTable.Provider
      columns={transactionColumns}
      data={transactions || []}
      handleReachedBottom={handleFetchMore}
      stickyColumns={['avatar', 'name']}
      className="mt-1.5"
      moreColumn={transactionMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > transactions?.length && (
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
