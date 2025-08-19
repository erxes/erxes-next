import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROGRESS_BY_MEMBER } from '~/modules/project/graphql/queries/getProjectProgressByMember';
import { IProjectProgressByMember } from '@/project/types';

interface IGetProjectQueryResponse {
  getProjectProgressByMember: IProjectProgressByMember[];
}

export const useGetProjectProgressByMember = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROGRESS_BY_MEMBER,
    options,
  );

  const projectProgressByMember =
    data?.getProjectProgressByMember || ([] as IProjectProgressByMember[]);

  return { projectProgressByMember, loading, refetch };
};
