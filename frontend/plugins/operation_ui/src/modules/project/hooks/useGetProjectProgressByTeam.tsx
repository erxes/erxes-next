import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROGRESS_BY_TEAM } from '~/modules/project/graphql/queries/getProjectProgressByTeam';

interface IGetProjectQueryResponse {
  getProjectProgressByTeam: any;
}

export const useGetProjectProgressByTeam = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROGRESS_BY_TEAM,
    options,
  );

  const getProjectProgressByTeam = data?.getProjectProgressByTeam;

  return { getProjectProgressByTeam, loading, refetch };
};
