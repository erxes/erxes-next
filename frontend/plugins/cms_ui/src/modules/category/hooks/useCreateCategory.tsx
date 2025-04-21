import { useMutation } from '@apollo/client';
import { CMS_CATEGORY_ADD } from '../graphql/mutations/addCategory';

export function useAddCategory() {
  const [categoryAdd, { loading, error }] = useMutation(CMS_CATEGORY_ADD);

  return { categoryAdd, loading, error };
}
