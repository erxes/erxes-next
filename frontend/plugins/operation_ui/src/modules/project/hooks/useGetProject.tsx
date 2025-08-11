import { IProject } from '@/project/types';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT } from '@/project/graphql/queries/getProject';

interface IGetProjectQueryResponse {
  getProject: IProject;
}

export const useGetProject = ({ projectId, options }: { projectId: string, options?: QueryHookOptions }) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT,
    {
      variables: {
        _id: projectId,
        ...options?.variables,
      },
      ...options,
    },
  );

  const project = data?.getProject;

  return { project, loading, refetch };
};
