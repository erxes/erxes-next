import { StudentHeader } from '~/modules/students/components/StudentHeader';
import { StudentRecordTable } from '~/modules/students/components/StudentRecordTable';

const StudentIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <StudentHeader />
      <StudentRecordTable />
    </div>
  );
};

export default StudentIndexPage;
