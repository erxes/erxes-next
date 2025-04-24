import { RecordTable } from 'erxes-ui/modules/record-table';
import { COURSES_PER_PAGE, useCourses } from '@/courses/hooks/useCourses';
import { courseMoreColumn } from '@/courses/components/CourseMoreColumn';
import { courseColumns } from '@/courses/components/CourseColumns';

export const CoursesRecordTable = () => {
  const { courses, handleFetchMore, loading, pageInfo } = useCourses({
    variables: {
      perPage: COURSES_PER_PAGE,
      page: 1,
    },
  });

  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    pageInfo || {};

  return (
    <RecordTable.Provider
      columns={courseColumns}
      data={courses || []}
      stickyColumns={['name']}
      className="mt-1.5"
      moreColumn={courseMoreColumn}
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={courses?.length}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body className="rounded-lg overflow-hidden">
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
              startCursor={startCursor}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.CursorRowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
              endCursor={endCursor}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
    </RecordTable.Provider>
  );
};
