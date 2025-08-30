import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_CYCLE_PROGRESS_BY_PROJECT } from '@/cycle/graphql/queries/getCycleProgressByProject';
import { ICycleProgressByProject } from '@/cycle/types';
import { useEffect } from 'react';
import { TASK_CHANGED } from '@/task/graphql/subscriptions/taskChanged';

interface IGetCycleQueryResponse {
  getCycleProgressByProject: ICycleProgressByProject[];
}

export const useGetCycleProgressByProject = (options: QueryHookOptions) => {
  const { data, loading, refetch, subscribeToMore } =
    useQuery<IGetCycleQueryResponse>(GET_CYCLE_PROGRESS_BY_PROJECT, options);

  const cycleProgressByProject = data?.getCycleProgressByProject;

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: TASK_CHANGED,
      variables: { filter: { cycleId: options.variables?._id } },
      updateQuery: () => {
        refetch();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [options.variables?._id, subscribeToMore, refetch]);

  return { cycleProgressByProject, loading, refetch };
};
