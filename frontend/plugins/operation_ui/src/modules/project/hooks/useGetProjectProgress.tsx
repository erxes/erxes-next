import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROGRESS } from '~/modules/project/graphql/queries/getProjectProgress';
import { IProjectProgress } from '~/modules/project/types';

interface IGetProjectQueryResponse {
  getProjectProgress: IProjectProgress;
}

export const useGetProjectProgress = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROGRESS,
    options,
  );

  const projcetProgress = data?.getProjectProgress;

  return { projcetProgress, loading, refetch };
};
