import { RecordTable } from 'erxes-ui';
import { columns } from './columns';
import { usePosList } from '../create-pos/hooks/usePosList';


export const PosRecordTable = () => {
  const { data, loading } = usePosList({
    variables: {
      page: 1,
      perPage: 20,
    },
  });
  
  const posList = data?.posList || [];
  const totalCount = posList.length;

  return (
    <RecordTable.Provider
      columns={columns}
      data={posList || []}
      className="mt-1.5"
      stickyColumns={['name']}
    >
      <RecordTable>
        <RecordTable.Header />
        {!loading && (
          <RecordTable.Body>
            {totalCount > posList?.length && (
              <RecordTable.RowSkeleton
                rows={4}
              />
            )}
          </RecordTable.Body>
        )}
      </RecordTable>
    </RecordTable.Provider>
  );
};