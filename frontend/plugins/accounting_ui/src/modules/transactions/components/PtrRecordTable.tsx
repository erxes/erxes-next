import { useTransactions } from '../hooks/useTransactions';
import { transactionColumns } from './TransactionsTableColumns';
import { RecordTable } from 'erxes-ui';

export const PtrRecordTable = () => {
  const { transactions, loading, totalCount, handleFetchMore } =
    useTransactions();

  return (
    <RecordTable.Provider
      columns={transactionColumns}
      data={transactions || []}
      stickyColumns={['avatar', 'name']}
      className="mt-1.5"
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          <RecordTable.RowList />
          {!loading && totalCount > transactions?.length && (
            <RecordTable.RowSkeleton rows={4} handleInView={handleFetchMore} />
          )}
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};
