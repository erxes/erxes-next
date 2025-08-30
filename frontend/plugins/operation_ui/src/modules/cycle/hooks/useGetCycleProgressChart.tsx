import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_CYCLE_PROGRESS_CHART } from '@/cycle/graphql/queries/getCycleProgressChart';
import { useEffect } from 'react';
import { TASK_CHANGED } from '@/task/graphql/subscriptions/taskChanged';

interface IGetCycleQueryResponse {
  getCycleProgressChart: {
    totalScope: number;
    chartData: {
      date: string;
      started: number;
      completed: number;
    }[];
  };
}

export const useGetCycleProgressChart = (options: QueryHookOptions) => {
  const { data, loading, refetch, subscribeToMore } =
    useQuery<IGetCycleQueryResponse>(GET_CYCLE_PROGRESS_CHART, options);

  const getCycleProgressChart = data?.getCycleProgressChart;

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

  return { getCycleProgressChart, loading, refetch };
};
