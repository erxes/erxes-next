import { RecordTable } from 'erxes-ui/modules/record-table';
import { COURSES_PER_PAGE, useCourses } from '@/courses/hooks/useCourses';
import { courseMoreColumn } from '@/courses/components/CourseMoreColumn';
import { courseColumns } from '@/courses/components/CourseColumns';

export const CoursesRecordTable = () => {
  const { courses, handleFetchMore, loading, totalCount } = useCourses({
    variables: {
      perPage: COURSES_PER_PAGE,
      page: 1,
    },
  });

  return (
    <RecordTable.Provider
      columns={courseColumns}
      data={courses || []}
      handleReachedBottom={handleFetchMore}
      stickyColumns={['avatar', 'name']}
      className="mt-1.5"
      moreColumn={courseMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > courses?.length && (
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
