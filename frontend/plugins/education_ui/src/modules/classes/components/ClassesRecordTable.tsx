import { RecordTable } from 'erxes-ui';
import { useClasses } from '@/classes/hooks/useClasses';
import { classColumns } from '@/classes/components/ClassesColumns';
import { ClassCommandBar } from '@/classes/components/ClassCommandBar';

export const ClassesRecordTable = () => {
  const { classes, handleFetchMore, loading, pageInfo } = useClasses({});

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  return (
    <RecordTable.Provider
      columns={classColumns}
      data={classes || []}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={classes?.length}
        sessionKey="classes_cursor"
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
      <ClassCommandBar />
    </RecordTable.Provider>
  );
};
