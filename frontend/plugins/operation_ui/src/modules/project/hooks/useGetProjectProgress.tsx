import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROGRESS } from '~/modules/project/graphql/queries/getProjectProgress';

interface IGetProjectQueryResponse {
  getProjectProcess: any;
}

export const useGetProjectProgress = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROGRESS,
    options,
  );

  const getProjectProgress = data?.getProjectProcess;

  return { getProjectProgress, loading, refetch };
};
