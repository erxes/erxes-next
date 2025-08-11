import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_PROJECT_PROCESS_BY_MEMBER } from '@/project/graphql/queries/getProjectProccesByMember';

interface IGetProjectQueryResponse {
  getProjectProcessByMember: any;
}

export const useGetProjectProcessByMember = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetProjectQueryResponse>(
    GET_PROJECT_PROCESS_BY_MEMBER,
    options,
  );

  const projectProcessByMember = data?.getProjectProcessByMember;

  return { projectProcessByMember, loading, refetch };
};
