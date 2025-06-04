import { RecordTable } from 'erxes-ui';
import { useTeachers } from '@/teachers/hooks/useTeachers';
import { teacherColumns } from '@/teachers/components/TeacherColumns';

const TeacherTable = () => {
  const { teachers, handleFetchMore, loading, error, pageInfo } = useTeachers(
    {},
  );

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  if (error) {
    return (
      <div className="text-destructive">
        Error loading members: {error.message}
      </div>
    );
  }
  return (
    <RecordTable.Provider
      columns={teacherColumns}
      data={teachers || []}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={teachers?.length}
        sessionKey="teachers_cursor"
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
    </RecordTable.Provider>
  );
};

export { TeacherTable };
