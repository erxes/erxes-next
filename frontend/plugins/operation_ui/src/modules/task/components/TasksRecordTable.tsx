import { RecordTable } from 'erxes-ui';
import { useTasks } from '@/task/hooks/useGetTasks';

export const TasksRecordTable = ({ type }: { type: string }) => {
  const { tasks } = useTasks();

  console.log(tasks);

  return (
    <RecordTable.Provider columns={[]} data={[]}>
      <RecordTable />
    </RecordTable.Provider>
  );
};
