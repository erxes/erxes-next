import { useMutation } from '@apollo/client';
import { REMOVE_TAG } from '../graphql/mutations/tagsMutations';

export function useRemoveTag() {
  const [removeTagMutation, { loading, error }] = useMutation(REMOVE_TAG);

  const removeTag = async (tagId: string): Promise<boolean> => {
    try {
      await removeTagMutation({ variables: { _id: tagId } });
      return true;
    } catch (err) {
      console.error('Error removing tag:', err);
      return false;
    }
  };

  return {
    removeTag,
    loading,
    error,
  };
}
