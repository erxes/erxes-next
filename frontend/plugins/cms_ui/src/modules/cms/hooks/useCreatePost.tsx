import { useMutation } from '@apollo/client';
import { CMS_POST_ADD } from '../graphql/mutations/addPost';

export function useAddPost() {
  const [tagAdd, { loading, error }] = useMutation(CMS_POST_ADD);

  return { tagAdd, loading, error };
}
