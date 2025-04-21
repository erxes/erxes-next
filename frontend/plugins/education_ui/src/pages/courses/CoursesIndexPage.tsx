import { useQueryState } from 'erxes-ui';
import { useAtom } from 'jotai';
import { renderingCourseDetailAtom } from '@/courses/detail/states/courseDetailStates';
import { CoursesHeader } from '@/courses/components/CoursesHeader';
import { CoursesRecordTable } from '@/courses/components/CoursesRecordTable';

export const CoursesIndexPage = () => {
  const [renderingCourseDetail] = useAtom(renderingCourseDetailAtom);
  const [courseId] = useQueryState('course_id');

  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <CoursesHeader />
      {!(renderingCourseDetail && courseId) && <CoursesRecordTable />}
      {/* <CourseDetail /> */}
    </div>
  );
};
