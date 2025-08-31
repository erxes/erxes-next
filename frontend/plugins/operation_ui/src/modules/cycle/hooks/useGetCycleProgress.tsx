import { QueryHookOptions, useQuery } from '@apollo/client';
import { TASK_CHANGED } from '@/task/graphql/subscriptions/taskChanged';
import { IProjectProgress } from '@/project/types';
import { GET_CYCLE_PROGRESS } from '@/cycle/graphql/queries/getCycleProgress';
import { useEffect } from 'react';

interface IGetCycleQueryResponse {
  getCycleProgress: IProjectProgress;
}

interface IGetCycleQueryVariables {
  _id: string;
}

export const useGetCycleProgress = (
  options: QueryHookOptions<IGetCycleQueryResponse, IGetCycleQueryVariables>,
) => {
  const { data, loading, refetch, subscribeToMore } = useQuery<
    IGetCycleQueryResponse,
    IGetCycleQueryVariables
  >(GET_CYCLE_PROGRESS, options);

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

  const cycleProgress = data?.getCycleProgress;

  return { cycleProgress, loading, refetch };
};
