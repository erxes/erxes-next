import { ClassesHeader } from '~/modules/classes/components/ClassesHeader';
import { ClassesRecordTable } from '~/modules/classes/components/ClassesRecordTable';

const ClassIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <ClassesHeader />
      <ClassesRecordTable />
    </div>
  );
};

export default ClassIndexPage;
