import { useMutation } from '@apollo/client';
import { tagsAdd } from '../graphql/mutations/tagsMutations';

export const useTagsAdd = () => {
  const [addTag, { loading }] = useMutation(tagsAdd);

  return {
    addTag,
    loading,
  };
};
