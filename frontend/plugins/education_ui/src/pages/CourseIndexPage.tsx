import { CoursesHeader } from '@/courses/components/CoursesHeader';
import { CoursesRecordTable } from '@/courses/components/CoursesRecordTable';
import { CourseDetail } from '~/modules/courses/detail/components/CourseDetail';

const CourseIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <CoursesHeader />
      <CoursesRecordTable />
      <CourseDetail />
    </div>
  );
};

export default CourseIndexPage;
