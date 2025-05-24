import { MutationHookOptions, useMutation } from '@apollo/client';
import { ADD_TAG } from '../graphql/mutations/tagsMutations';

export const useTagsAdd = () => {
  const [addTag, { loading }] = useMutation(ADD_TAG);

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    addTag({
      ...options,
      variables,
      refetchQueries: ['Tags'],
    });
  };

  return {
    addTag: mutate,
    loading,
  };
};
