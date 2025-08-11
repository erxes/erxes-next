import { useParams } from 'react-router-dom';
import { useGetTask } from '@/task/hooks/useGetTask';

export const TaskDetails = () => {
  const { taskId } = useParams();

  const { task } = useGetTask({
    variables: { _id: taskId },
    skip: !taskId,
  });

  if (!taskId) {
    return null;
  }

  return <div>{task?.name}</div>;
};
