import { useQuery } from '@apollo/client';
import { GET_TEAM_MEMBERS } from '@/team/graphql/queries/getTeamMembers';
import { ITeamMember } from '@/team/types';

interface IGetTeamMembersQueryResponse {
  getTeamMembers: ITeamMember[];
}

export const useGetTeamMembers = ({ teamId }: { teamId?: string }) => {
  const { data, loading, refetch } = useQuery<IGetTeamMembersQueryResponse>(
    GET_TEAM_MEMBERS,
    {
      variables: {
        teamId,
      },
    },
  );

  const members = data?.getTeamMembers;

  return { members, loading, refetch };
};
