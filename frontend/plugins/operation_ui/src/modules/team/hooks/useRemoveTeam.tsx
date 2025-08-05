import { useMutation } from '@apollo/client';
import { REMOVE_TEAM } from '../graphql/mutations/removeTeam';
import { MutationHookOptions } from '@apollo/client';

export const useRemoveTeam = () => {
  const [_removeTeam, { loading, error }] = useMutation(REMOVE_TEAM);
  const removeTeam = (options: MutationHookOptions) => {
    return _removeTeam({
      ...options,
    });
  };
  return { removeTeam, loading, error };
};
