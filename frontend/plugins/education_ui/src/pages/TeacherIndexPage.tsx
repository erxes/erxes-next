import { TeacherTable } from '@/teachers/components/TeacherTable';
import { TeacherHeader } from '@/teachers/components/TeacherHeader';

const TeacherIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <TeacherHeader />
      <TeacherTable />
    </div>
  );
};

export default TeacherIndexPage;
