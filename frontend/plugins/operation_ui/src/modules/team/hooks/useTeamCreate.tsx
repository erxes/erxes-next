import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { ADD_TEAM } from '~/modules/team/graphql/mutations/addTeam';
import { ITeam } from '~/modules/team/types';
import { useGetTeams } from '~/modules/team/hooks/useGetTeams';

interface CreateTeamMutationResponse {
  createTeam: ITeam;
}

export const useTeamCreate = () => {
  const { refetch } = useGetTeams();
  const [addTeam, { loading, error }] =
    useMutation<CreateTeamMutationResponse>(ADD_TEAM);

  const handleAddTeam = (
    options: MutationFunctionOptions<CreateTeamMutationResponse, any>,
  ) => {
    addTeam({
      ...options,
      onCompleted: (data) => {
        options?.onCompleted?.(data);
        refetch();
      },
    });
  };

  return { addTeam: handleAddTeam, loading, error };
};
