import { QueryHookOptions, useQuery } from '@apollo/client';
import { IProjectProgressByMember } from '@/project/types';
import { useEffect } from 'react';
import { TASK_LIST_CHANGED } from '@/task/graphql/subscriptions/taskListChanged';
import { GET_CYCLE_PROGRESS_BY_MEMBER } from '@/cycle/graphql/queries/getCycleProgressByMember';

interface IGetCycleQueryResponse {
  getCycleProgressByMember: IProjectProgressByMember[];
}

export const useGetCycleProgressByMember = (options: QueryHookOptions) => {
  const { data, loading, refetch, subscribeToMore } =
    useQuery<IGetCycleQueryResponse>(GET_CYCLE_PROGRESS_BY_MEMBER, options);

  const cycleProgressByMember =
    data?.getCycleProgressByMember || ([] as IProjectProgressByMember[]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: TASK_LIST_CHANGED,
      variables: { filter: { cycleId: options.variables?._id } },
      updateQuery: () => {
        refetch();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [options.variables?._id, subscribeToMore, refetch]);

  return { cycleProgressByMember, loading, refetch };
};
