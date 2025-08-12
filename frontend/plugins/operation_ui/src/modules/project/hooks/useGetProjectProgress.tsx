import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROGRESS } from '~/modules/project/graphql/queries/getProjectProgress';

interface IGetProjectQueryResponse {
  getProjectProgress: any;
}

export const useGetProjectProgress = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROGRESS,
    options,
  );

  const getProjectProgress = data?.getProjectProgress;

  return { getProjectProgress, loading, refetch };
};
