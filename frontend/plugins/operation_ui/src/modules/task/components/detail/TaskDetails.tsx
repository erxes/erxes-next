import { useGetTask } from '@/task/hooks/useGetTask';

export const TaskDetails = ({ taskId }: { taskId: string }) => {
  const { task } = useGetTask({
    variables: { _id: taskId },
    skip: !taskId,
  });

  return <div>{task?.name}</div>;
};
