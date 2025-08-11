import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROCESS_CHART } from '@/project/graphql/queries/getProjectProcessChart';

interface IGetProjectQueryResponse {
  getProjectProcessChart: any;
}

export const useGetProjectProcessChart = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROCESS_CHART,
    options,
  );

  const projectProcessChart = data?.getProjectProcessChart;

  return { projectProcessChart, loading, refetch };
};
