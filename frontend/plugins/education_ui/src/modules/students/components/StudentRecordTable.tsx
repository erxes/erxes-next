import { RecordTable } from 'erxes-ui';
import { studentColumns } from '@/students/components/StudentColumns';
import { StudentCommandBar } from '@/students/components/StudentCommandBar';
import { useStudents } from '@/students/hooks/useStudents';

export const StudentRecordTable = () => {
  const { students, handleFetchMore, loading, pageInfo } = useStudents({});

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  return (
    <RecordTable.Provider
      columns={studentColumns}
      data={students || []}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={students?.length}
        sessionKey="students_cursor"
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
      <StudentCommandBar />
    </RecordTable.Provider>
  );
};
