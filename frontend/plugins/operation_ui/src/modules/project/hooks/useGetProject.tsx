import { IProject } from '@/project/types';
import { useQuery } from '@apollo/client';
import { GET_PROJECT } from '@/project/graphql/queries/getProject';
import { QueryHookOptions } from '@apollo/client';

interface IGetProjectQueryResponse {
  getProject: IProject;
}

export const useGetProject = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT,
    options,
  );

  const project = data?.getProject;

  return { project, loading, refetch };
};
