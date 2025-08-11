import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROGRESS_BY_MEMBER } from '~/modules/project/graphql/queries/getProjectProgressByMember';

interface IGetProjectQueryResponse {
  getProjectProgressByMember: any;
}

export const useGetProjectProgressByMember = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROGRESS_BY_MEMBER,
    options,
  );

  const getProjectProgressByMember = data?.getProjectProgressByMember;

  return { getProjectProgressByMember, loading, refetch };
};
