import { useMutation } from '@apollo/client';
import { CMS_WEBSITE_ADD } from '../graphql/mutations/addWebsite';

export function useAddWebsite() {
  const [websiteAdd, { loading, error }] = useMutation(CMS_WEBSITE_ADD);

  return { websiteAdd, loading, error };
}
