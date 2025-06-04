import { CourseCategoryHeader } from '~/modules/courses/components/category/CourseCategoryHeader';
import { CourseCategoryRecordTable } from '~/modules/courses/components/category/CourseCategoryRecordTable';

const CourseCategoryPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <CourseCategoryHeader />
      <CourseCategoryRecordTable />
    </div>
  );
};

export default CourseCategoryPage;
