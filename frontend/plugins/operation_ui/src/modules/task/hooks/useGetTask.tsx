import { ITask } from '@/task/types';
import { useQuery } from '@apollo/client';
import { GET_TASK } from '@/task/graphql/queries/getTask';
import { QueryHookOptions } from '@apollo/client';

interface IGetTaskQueryResponse {
  getTask: ITask;
}

export const useGetTask = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetTaskQueryResponse>(
    GET_TASK,
    options,
  );

  const task = data?.getTask;

  return { task, loading, refetch };
};
