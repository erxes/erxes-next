import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { GET_TEAM } from '~/modules/team/graphql/queries/getTeam';
import { ITeam } from '@/team/types';

interface IUseGetTeamResponse {
  getTeam: ITeam;
  loading: boolean;
  refetch: any;
}

export const useGetTeam = () => {
  const { id: teamId } = useParams();

  const { data, loading, refetch } = useQuery<IUseGetTeamResponse>(GET_TEAM, {
    variables: {
      _id: teamId,
    },
  });

  const team = data?.getTeam;

  return { team, loading, refetch };
};
