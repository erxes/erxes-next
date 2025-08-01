import { useQuery } from '@apollo/client';
import { GET_TEAMS } from '@/team/graphql/queries/getTeams';
import { ITeam } from '@/team/types';

interface IGetTeamsQueryResponse {
  getTeams: ITeam[];
}

export const useGetTeams = () => {
  const { data, loading, refetch } =
    useQuery<IGetTeamsQueryResponse>(GET_TEAMS);

  const teams = data?.getTeams;

  return { teams, loading, refetch };
};
