import { ITask } from '@/task/types';
import { useQuery } from '@apollo/client';
import { GET_TASK } from '@/task/graphql/queries/getTask';

interface IGetTaskQueryResponse {
  getTask: ITask;
}

export const useGetTask = ({ taskId }: { taskId: string }) => {
  const { data, loading, refetch } = useQuery<IGetTaskQueryResponse>(GET_TASK, {
    variables: {
      _id: taskId,
    },
  });

  const task = data?.getTask;

  return { task, loading, refetch };
};
