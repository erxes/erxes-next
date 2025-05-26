import { RecordTable } from 'erxes-ui';
import { useCourses } from '@/courses/hooks/useCourses';
import { courseColumns } from '@/courses/components/CourseColumns';
import { CourseCommandBar } from '@/courses/components/CourseCommandBar';

export const CourseRecordTable = () => {
  const { courses, handleFetchMore, loading, pageInfo } = useCourses({});

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  return (
    <RecordTable.Provider
      columns={courseColumns}
      data={courses || []}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={courses?.length}
        sessionKey="courses_cursor"
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
      <CourseCommandBar />
    </RecordTable.Provider>
  );
};
