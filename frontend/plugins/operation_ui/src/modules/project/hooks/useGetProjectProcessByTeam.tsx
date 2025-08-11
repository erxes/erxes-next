import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROCESS_BY_TEAM } from '@/project/graphql/queries/getProjectProcessByTeam';

interface IGetProjectQueryResponse {
  getProjectProcessByTeam: any;
}

export const useGetProjectProcessByTeam = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROCESS_BY_TEAM,
    options,
  );

  const projectProcessByTeam = data?.getProjectProcessByTeam;

  return { projectProcessByTeam, loading, refetch };
};
