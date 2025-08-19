import { ITask } from '@/task/types';
import { useQuery } from '@apollo/client';
import { GET_TASK } from '@/task/graphql/queries/getTask';
import { TASK_CHANGED } from '@/task/graphql/subscriptions/taskChanged';
import { QueryHookOptions } from '@apollo/client';
import { useEffect } from 'react';

interface IGetTaskQueryResponse {
  getTask: ITask;
}

interface ITaskChanged {
  operationTaskChanged: ITask;
}

export const useGetTask = (options: QueryHookOptions) => {
  const { data, loading, refetch, subscribeToMore } =
    useQuery<IGetTaskQueryResponse>(GET_TASK, options);

  const task = data?.getTask;

  useEffect(() => {
    const unsubscribe = subscribeToMore<ITaskChanged>({
      document: TASK_CHANGED,
      variables: { _id: task?._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!prev || !subscriptionData.data) return prev;

        const newData = subscriptionData.data.operationTaskChanged;

        return { getTask: newData };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [task?._id, subscribeToMore]);

  return { task, loading, refetch };
};
