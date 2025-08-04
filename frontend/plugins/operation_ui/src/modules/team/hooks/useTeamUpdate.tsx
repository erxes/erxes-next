import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { UPDATE_TEAM } from '@/team/graphql/mutations/updateTeam';
import { ITeam } from '@/team/types';
import { GET_TEAM } from '@/team/graphql/queries/getTeam';
interface UpdateTeamMutationResponse {
  updateTeam: ITeam;
}

export const useTeamUpdate = () => {
  const [updateTeam, { loading, error }] =
    useMutation<UpdateTeamMutationResponse>(UPDATE_TEAM);

  const handleUpdateTeam = (
    options: MutationFunctionOptions<UpdateTeamMutationResponse, any>,
  ) => {
    updateTeam({
      ...options,
      onCompleted: (data) => {
        options?.onCompleted?.(data);
      },
      refetchQueries: [GET_TEAM],
    });
  };

  return { updateTeam: handleUpdateTeam, loading, error };
};
