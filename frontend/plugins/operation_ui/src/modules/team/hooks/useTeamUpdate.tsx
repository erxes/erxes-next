import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { UPDATE_TEAM } from '~/modules/team/graphql/mutations/updateTeam';
import { ITeam } from '~/modules/team/types';

interface CreateTeamMutationResponse {
  updateTeam: ITeam;
}

export const useTeamUpdate = () => {
  const [updateTeam, { loading, error }] =
    useMutation<CreateTeamMutationResponse>(UPDATE_TEAM);

  const handleUpdateTeam = (
    options: MutationFunctionOptions<CreateTeamMutationResponse, any>,
  ) => {
    updateTeam({
      ...options,
      onCompleted: (data) => {
        options?.onCompleted?.(data);
      },
    });
  };

  return { updateTeam: handleUpdateTeam, loading, error };
};
