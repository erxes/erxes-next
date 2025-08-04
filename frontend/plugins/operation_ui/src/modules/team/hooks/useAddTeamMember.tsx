import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { useGetTeams } from '@/team/hooks/useGetTeams';
import { ADD_TEAM_MEMBERS } from '@/team/graphql/mutations/addTeamMembers';
import { ITeamMember } from '@/team/types';

interface AddTeamMemberMutationResponse {
  addTeamMember: ITeamMember;
}

export const useAddTeamMember = () => {
  const { refetch } = useGetTeams();
  const [addTeamMember, { loading, error }] =
    useMutation<AddTeamMemberMutationResponse>(ADD_TEAM_MEMBERS);

  const handleAddTeamMember = (
    options: MutationFunctionOptions<AddTeamMemberMutationResponse, any>,
  ) => {
    addTeamMember({
      ...options,
      onCompleted: (data) => {
        options?.onCompleted?.(data);
        refetch();
      },
    });
  };

  return { addTeamMember: handleAddTeamMember, loading, error };
};
