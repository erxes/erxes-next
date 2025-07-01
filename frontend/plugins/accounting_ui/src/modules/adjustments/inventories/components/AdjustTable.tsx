import { useAdjustInventories } from '../hooks/useAdjustInventory';
import { adjustTableColumns } from './AdjustTableColumns';
import { RecordTable } from 'erxes-ui';

export const AdjustTable = () => {
  const { trRecords, loading, totalCount, handleFetchMore } =
    useAdjustInventories();

  return (
    <RecordTable.Provider
      columns={adjustTableColumns}
      data={trRecords || []}
      stickyColumns={[]}
      className='m-3'
    >
      <RecordTable.Scroll>
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.RowList />
            {!loading && totalCount > trRecords?.length && (
              <RecordTable.RowSkeleton rows={4} handleInView={handleFetchMore} />
            )}
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Scroll>
    </RecordTable.Provider>
  );
};
