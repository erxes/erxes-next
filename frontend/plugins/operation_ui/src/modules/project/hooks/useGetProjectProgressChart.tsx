import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROGRESS_CHART } from '~/modules/project/graphql/queries/getProjectProgressChart';

interface IGetProjectQueryResponse {
  getProjectProgressChart: {
    totalScope: number;
    chartData: {
      date: string;
      started: number;
      completed: number;
    }[];
  };
}

export const useGetProjectProgressChart = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROGRESS_CHART,
    options,
  );

  const getProjectProgressChart = data?.getProjectProgressChart;

  return { getProjectProgressChart, loading, refetch };
};
