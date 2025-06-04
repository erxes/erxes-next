import { CourseHeader } from '~/modules/courses/components/CourseHeader';
import { CourseRecordTable } from '~/modules/courses/components/CourseRecordTable';
import { CourseDetail } from '~/modules/courses/detail/components/CourseDetail';

const CourseIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <CourseHeader />
      <CourseRecordTable />
      <CourseDetail />
    </div>
  );
};

export default CourseIndexPage;
