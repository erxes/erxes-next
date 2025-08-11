import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROCESS } from '@/project/graphql/queries/getProjectProcess';

interface IGetProjectQueryResponse {
  getProjectProcess: any;
}

export const useGetProjectProcess = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROCESS,
    options,
  );

  const projectProcess = data?.getProjectProcess;

  return { projectProcess, loading, refetch };
};
