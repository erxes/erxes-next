import { IProject } from '@/project/types';
import { useQuery } from '@apollo/client';
import { GET_PROJECT } from '@/project/graphql/queries/getProject';

interface IGetProjectQueryResponse {
  getProject: IProject;
}

export const useGetProject = ({ projectId }: { projectId: string }) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT,
    {
      variables: {
        _id: projectId,
      },
    },
  );

  const project = data?.getProject;

  return { project, loading, refetch };
};
