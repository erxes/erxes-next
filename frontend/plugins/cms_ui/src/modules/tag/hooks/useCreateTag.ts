import { useMutation } from '@apollo/client';
import { CMS_TAG_ADD } from '../graphql/mutations/addTag';

export function useAddTag() {
  const [tagAdd, { loading, error }] = useMutation(CMS_TAG_ADD);

  return { tagAdd, loading, error };
}
