import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_STATUS_BY_TEAM } from '../graphql/queries/getStatusByTeam';
import { IStatus } from '@/task/types';

interface IUseGetStatusByTeamResponse {
  getStatusesChoicesByTeam: IStatus[];
}

export const useGetStatusByTeam = (options: QueryHookOptions) => {
  const { data, loading, error } = useQuery<IUseGetStatusByTeamResponse>(
    GET_STATUS_BY_TEAM,
    options,
  );

  return {
    statuses: data?.getStatusesChoicesByTeam || [],
    loading,
    error,
  };
};
